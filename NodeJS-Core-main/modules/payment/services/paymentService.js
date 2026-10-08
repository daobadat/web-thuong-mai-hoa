const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const { Order, PaymentTransaction, sequelize } = require("models");

function safeCompare(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).map(encodeURIComponent).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(/%20/g, "+");
  }
  return sorted;
}

const paymentService = {
  buildVietQrUrl: (orderNumber, amount) => {
    const bankId = process.env.VIETQR_BANK_ID || "MB";
    const accountNo = process.env.VIETQR_ACCOUNT_NO;
    const accountName = process.env.VIETQR_ACCOUNT_NAME;
    if (!accountNo) throw new Error("VIETQR configuration is missing.");
    const description = `KFLOWER ${orderNumber}`;
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  },

  buildMomoPayUrl: async (order) => {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey   = process.env.MOMO_ACCESS_KEY;
    const secretKey   = process.env.MOMO_SECRET_KEY;
    const endpoint    = process.env.MOMO_ENDPOINT;
    if (!partnerCode || !accessKey || !secretKey || !endpoint)
      throw new Error("MoMo configuration is missing. Check .env");

    const requestId   = partnerCode + Date.now();
    const orderId     = order.id;
    const orderInfo   = `Thanh toan don hang ${order.order_number}`;
    const redirectUrl = `${process.env.APP_BASE_URL}/checkout/success?orderId=${orderId}&method=momo`;
    const ipnUrl      = `${process.env.API_BASE_URL}/api/payments/webhook`;
    const amount      = Math.round(Number(order.total_amount)).toString();
    const requestType = "captureWallet";
    const extraData   = "";

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
    const requestBody = { partnerCode, partnerName: "Flower Shop", storeId: "FlowerShop_Main",
      requestId, amount, orderId, orderInfo, redirectUrl, ipnUrl, requestType, extraData, lang: "vi", signature };

    const response = await axios.post(endpoint, requestBody, { timeout: 10000 });
    if (response.data && response.data.resultCode === 0) return response.data.payUrl;
    throw new Error(`MoMo Error: ${response.data.message || "Khong the tao thanh toan"}`);
  },

  buildVnpayPayUrl: (req, order) => {
    const tmnCode   = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl    = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;
    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl)
      throw new Error("VNPay configuration is missing. Check .env");

    const date = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const createDate = date.getFullYear() + pad(date.getMonth()+1) + pad(date.getDate()) +
      pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());

    let vnpParams = {
      vnp_Version: "2.1.0", vnp_Command: "pay", vnp_TmnCode: tmnCode,
      vnp_Locale: "vn", vnp_CurrCode: "VND", vnp_TxnRef: order.id,
      vnp_OrderInfo: `Thanh toan don hang ${order.order_number}`, vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(order.total_amount)) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1",
      vnp_CreateDate: createDate,
    };
    vnpParams = sortObject(vnpParams);
    const signData = qs.stringify(vnpParams, { encode: false });
    const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, "utf-8")).digest("hex");
    vnpParams.vnp_SecureHash = signed;
    return vnpUrl + "?" + qs.stringify(vnpParams, { encode: false });
  },

  handleMomoIpn: async (body) => {
    const { partnerCode, orderId, requestId, amount, orderInfo, orderType,
      transId, resultCode, message, responseTime, extraData, signature } = body;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}` +
      `&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}` +
      `&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSig = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
    if (signature !== expectedSig) { const e = new Error("Invalid MoMo Signature"); e.status = 400; throw e; }

    const t = await sequelize.transaction();
    try {
      const order = await Order.findOne({ where: { id: orderId }, transaction: t, lock: true });
      if (!order) { await t.rollback(); const e = new Error("Order not found"); e.status = 404; throw e; }
      if (order.payment_status === "paid") { await t.commit(); return { message: "Already paid" }; }

      if (Number(resultCode) === 0) {
        order.payment_status = "paid"; order.status = "confirmed"; order.paid_at = new Date();
        await order.save({ transaction: t });
        await PaymentTransaction.create({ order_id: order.id, payment_method: "momo",
          provider_transaction_id: String(transId), amount: Number(amount), status: "success", raw_response: body }, { transaction: t });
      } else {
        order.payment_status = "failed"; await order.save({ transaction: t });
        await PaymentTransaction.create({ order_id: order.id, payment_method: "momo",
          amount: Number(amount), status: "failed", raw_response: body }, { transaction: t });
      }
      await t.commit();
      return { message: "MoMo IPN processed" };
    } catch (err) { await t.rollback(); throw err; }
  },

  handleVnpayReturn: (query) => {
    let vnpParams = { ...query };
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash; delete vnpParams.vnp_SecureHashType;
    vnpParams = sortObject(vnpParams);
    const signData = qs.stringify(vnpParams, { encode: false });
    const signed = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET)
      .update(Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash !== signed) return { success: false, message: "Chu ky khong hop le" };
    const rspCode = vnpParams.vnp_ResponseCode;
    return { success: rspCode === "00", orderNumber: vnpParams.vnp_TxnRef,
      amount: parseFloat(vnpParams.vnp_Amount) / 100, transactionNo: vnpParams.vnp_TransactionNo, rspCode };
  },

  handleWebhook: async (headers, body) => {
    const apiKey = (headers["authorization"] || headers["x-api-key"] || "").replace("Bearer ", "");
    if (!safeCompare(apiKey, process.env.WEBHOOK_API_KEY || "")) throw new Error("Invalid Webhook API Key");

    const providerTxId = body.id ? String(body.id) : body.referenceCode;
    const content = body.content || body.description || "";
    const amount = body.transferAmount || body.amount || 0;
    const transferType = body.transferType || "in";
    if (transferType !== "in" && transferType !== "CREDIT") return { message: "Ignored non-incoming transaction" };

    let orderNumber = null;
    const matchFLW = content.match(/FLW[-\w]+/i);
    if (matchFLW) { orderNumber = matchFLW[0]; }
    else {
      for (const w of content.split(/\s+/)) {
        if (w.length < 5) continue;
        const tempOrder = await Order.findOne({ where: { order_number: w } });
        if (tempOrder) { orderNumber = w; break; }
      }
    }
    if (!orderNumber) { console.warn("Webhook: Could not extract order number:", content); throw new Error("Could not extract order number: " + content); }

    const t = await sequelize.transaction();
    try {
      const order = await Order.findOne({ where: { order_number: orderNumber }, transaction: t, lock: true });
      if (!order) { await t.rollback(); throw new Error(`Order ${orderNumber} not found`); }

      const existingTx = await PaymentTransaction.findOne({
        where: { provider_transaction_id: providerTxId, payment_method: "bank_transfer" }, transaction: t });
      if (existingTx) { await t.commit(); return { message: "Transaction already processed" }; }

      await PaymentTransaction.create({ order_id: order.id, payment_method: "bank_transfer",
        provider_transaction_id: providerTxId, amount, status: "success", raw_response: body }, { transaction: t });

      if (parseFloat(amount) >= parseFloat(order.total_amount)) {
        order.payment_status = "paid"; order.paid_at = new Date();
        if (order.status === "pending") order.status = "confirmed";
        await order.save({ transaction: t });
      } else {
        console.warn(`Order ${orderNumber} UNDERPAID. Expected ${order.total_amount}, got ${amount}`);
      }
      await t.commit();
      return { message: "Webhook processed successfully", order: order.order_number };
    } catch (error) { await t.rollback(); throw error; }
  },

  getPaymentStatus: async (orderNumber) => {
    const order = await Order.findOne({ where: { order_number: orderNumber },
      attributes: ["order_number", "payment_status", "status", "expires_at"] });
    if (!order) { const err = new Error("Order not found"); err.statusCode = 404; throw err; }
    if (order.expires_at && new Date() > new Date(order.expires_at) && order.payment_status !== "paid")
      return { order_number: order.order_number, payment_status: "expired", status: order.status };
    return order;
  },

  expireStaleOrders: async () => {
    const { Op } = require("sequelize");
    const [affectedCount] = await Order.update(
      { status: "cancelled", payment_status: "failed" },
      { where: { status: "pending", payment_status: { [Op.ne]: "paid" },
          expires_at: { [Op.not]: null, [Op.lt]: new Date() }, payment_method: { [Op.ne]: "cod" } } }
    );
    if (affectedCount > 0) console.log(`[Cron] Expired ${affectedCount} stale bank-transfer orders.`);
    return affectedCount;
  },
};

module.exports = paymentService;