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
      // Trả 200 cho provider để họ không retry liên tục
      return res.status(200).json({ success: false, message: err.message });
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
