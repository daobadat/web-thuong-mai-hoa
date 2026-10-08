const paymentService = require("modules/payment/services/paymentService");
const responseUtils = require("utils/responseUtils");

const paymentController = {
  /**
   * POST /payments/webhook
   * Nhận webhook từ SePay / Casso khi có giao dịch chuyển khoản
   */
  webhook: async (req, res) => {
    try {
      const result = await paymentService.handleWebhook(req.headers, req.body);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      console.error("Webhook error:", err.message);
      if (err.message === "Invalid Webhook API Key") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      return res.status(200).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /payments/momo-ipn
   * Nhận IPN callback từ MoMo (server-to-server)
   */
  momoIpn: async (req, res) => {
    try {
      const result = await paymentService.handleMomoIpn(req.body);
      return res.status(204).send();
    } catch (err) {
      console.error("MoMo IPN error:", err.message);
      const status = err.status || 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /payments/momo-create
   * Tạo đơn MoMo từ thông tin order có sẵn trong DB
   */
  momoCreate: async (req, res) => {
    try {
      const { orderId, orderNumber, totalAmount } = req.body;
      if (!orderId || !orderNumber || !totalAmount) {
        return res.status(400).json({ success: false, message: "Thieu thong tin don hang" });
      }
      const order = { id: orderId, order_number: orderNumber, total_amount: totalAmount };
      const payUrl = await paymentService.buildMomoPayUrl(order);
      return res.json({ success: true, payUrl });
    } catch (err) {
      console.error("MoMo create error:", err.message);
      return res.status(502).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /payments/vnpay-create
   * Tạo URL thanh toán VNPay
   */
  vnpayCreate: async (req, res) => {
    try {
      const { orderId, orderNumber, totalAmount } = req.body;
      if (!orderId || !orderNumber || !totalAmount) {
        return res.status(400).json({ success: false, message: "Thieu thong tin don hang" });
      }
      const order = { id: orderId, order_number: orderNumber, total_amount: totalAmount };
      const payUrl = paymentService.buildVnpayPayUrl(req, order);
      return res.json({ success: true, payUrl });
    } catch (err) {
      console.error("VNPay create error:", err.message);
      return res.status(502).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /payments/vnpay-return
   * VNPay redirect người dùng về sau thanh toán
   */
  vnpayReturn: async (req, res) => {
    try {
      const result = paymentService.handleVnpayReturn(req.query);
      // Redirect về frontend với kết quả
      const appBase = process.env.APP_BASE_URL || "http://localhost:3000";
      if (result.success) {
        return res.redirect(`${appBase}/checkout/success?method=vnpay&orderNumber=${result.orderNumber}`);
      } else {
        return res.redirect(`${appBase}/checkout/failed?method=vnpay&code=${result.rspCode}`);
      }
    } catch (err) {
      console.error("VNPay return error:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /payments/status/:orderNumber
   * Frontend poll trạng thái thanh toán (yêu cầu đăng nhập)
   */
  status: async (req, res) => {
    try {
      const orderNumber = req.params.orderNumber;
      const data = await paymentService.getPaymentStatus(orderNumber);
      return responseUtils.ok(res, data);
    } catch (err) {
      if (err.statusCode === 404) {
        return responseUtils.notFound(res);
      }
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = paymentController;