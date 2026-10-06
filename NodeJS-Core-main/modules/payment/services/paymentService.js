const crypto = require("crypto");
const { Order, PaymentTransaction, sequelize } = require("models");

/**
 * So sánh API key an toàn (chống timing attack)
 */
function safeCompare(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const paymentService = {
  /**
   * Tạo URL mã QR VietQR cho đơn hàng
   */
  buildVietQrUrl: (orderNumber, amount) => {
    const bankId = process.env.VIETQR_BANK_ID || "MB";
    const accountNo = process.env.VIETQR_ACCOUNT_NO;
    const accountName = process.env.VIETQR_ACCOUNT_NAME;

    if (!accountNo) {
      throw new Error("VIETQR configuration is missing.");
    }

    // Nội dung chuyển khoản = KFLOWER + mã đơn
    const description = `KFLOWER ${orderNumber}`;
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  },

  /**
   * Xử lý webhook từ SePay / Casso
   * SePay payload: { id, gateway, transactionDate, accountNumber, code, content, transferType, transferAmount, accumulated, referenceCode, description }
   */
  handleWebhook: async (headers, body) => {
    // 1. Xác thực API Key bằng timingSafeEqual
    const apiKey = (headers["authorization"] || headers["x-api-key"] || "").replace("Bearer ", "");
    const expectedApiKey = process.env.WEBHOOK_API_KEY || "";

    if (!expectedApiKey || !safeCompare(apiKey, expectedApiKey)) {
      throw new Error("Invalid Webhook API Key");
    }

    // 2. Parse dữ liệu webhook
    const providerTxId = body.id ? String(body.id) : body.referenceCode;
    const content = body.content || body.description || "";
    const amount = body.transferAmount || body.amount || 0;
    const transferType = body.transferType || "in";

    // Chỉ xử lý tiền vào
    if (transferType !== "in" && transferType !== "CREDIT") {
      return { message: "Ignored non-incoming transaction" };
    }

    // 3. Trích xuất mã đơn hàng từ nội dung chuyển khoản
    // Mã đơn có dạng FLW-1696556400000-1234
    let orderNumber = null;
    const matchFLW = content.match(/FLW[-\w]+/i);
    if (matchFLW) {
      orderNumber = matchFLW[0];
    } else {
      // Fallback: tìm từng từ trong content xem có khớp đơn nào không
      const words = content.split(/\s+/);
      for (const w of words) {
        if (w.length < 5) continue;
        const tempOrder = await Order.findOne({ where: { order_number: w } });
        if (tempOrder) {
          orderNumber = w;
          break;
        }
      }
    }

    if (!orderNumber) {
      console.warn("Webhook: Could not extract order number from content:", content);
      throw new Error("Could not extract order number from content: " + content);
    }

    // 4. Xử lý giao dịch trong transaction (SELECT ... FOR UPDATE)
    const t = await sequelize.transaction();
    try {
      const order = await Order.findOne({
        where: { order_number: orderNumber },
        transaction: t,
        lock: true, // SELECT ... FOR UPDATE
      });

      if (!order) {
        await t.rollback();
        throw new Error(`Order ${orderNumber} not found`);
      }

      // Idempotency: kiểm tra giao dịch đã xử lý chưa (provider, provider_tx_id)
      const existingTx = await PaymentTransaction.findOne({
        where: {
          provider_transaction_id: providerTxId,
          payment_method: "bank_transfer",
        },
        transaction: t,
      });

      if (existingTx) {
        await t.commit();
        return { message: "Transaction already processed" };
      }

      // Ghi nhận giao dịch
      await PaymentTransaction.create(
        {
          order_id: order.id,
          payment_method: "bank_transfer",
          provider_transaction_id: providerTxId,
          amount: amount,
          status: "success",
          raw_response: body,
        },
        { transaction: t }
      );

      // So sánh số tiền
      if (parseFloat(amount) >= parseFloat(order.total_amount)) {
        order.payment_status = "paid";
        order.paid_at = new Date();
        if (order.status === "pending") {
          order.status = "confirmed";
        }
        await order.save({ transaction: t });
      } else {
        // Thiếu tiền → KHÔNG tự duyệt, chỉ ghi log
        console.warn(
          `Order ${orderNumber} UNDERPAID. Expected ${order.total_amount}, got ${amount}`
        );
      }

      await t.commit();
      return { message: "Webhook processed successfully", order: order.order_number };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  /**
   * Lấy trạng thái thanh toán cho frontend poll
   */
  getPaymentStatus: async (orderNumber) => {
    const order = await Order.findOne({
      where: { order_number: orderNumber },
      attributes: ["order_number", "payment_status", "status", "expires_at"],
    });

    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    // Kiểm tra hết hạn
    if (
      order.expires_at &&
      new Date() > new Date(order.expires_at) &&
      order.payment_status !== "paid"
    ) {
      return {
        order_number: order.order_number,
        payment_status: "expired",
        status: order.status,
      };
    }

    return order;
  },

  /**
   * Cron: đánh dấu đơn hết hạn chưa thanh toán
   */
  expireStaleOrders: async () => {
    const { Op } = require("sequelize");
    const [affectedCount] = await Order.update(
      { status: "cancelled", payment_status: "failed" },
      {
        where: {
          status: "pending",
          payment_status: { [Op.ne]: "paid" },
          expires_at: { [Op.lt]: new Date() },
        },
      }
    );
    if (affectedCount > 0) {
      console.log(`[Cron] Expired ${affectedCount} stale orders.`);
    }
    return affectedCount;
  },
};

module.exports = paymentService;
