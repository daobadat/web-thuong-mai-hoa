const app = require("./index");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);

    // Cron: Dọn đơn hết hạn mỗi 5 phút
    const paymentService = require("modules/payment/services/paymentService");
    setInterval(async () => {
        try {
            await paymentService.expireStaleOrders();
        } catch (err) {
            console.error("[Cron] Error expiring stale orders:", err.message);
        }
    }, 5 * 60 * 1000); // 5 phút

    console.log("[Cron] Expire stale orders job scheduled (every 5 min).");
});