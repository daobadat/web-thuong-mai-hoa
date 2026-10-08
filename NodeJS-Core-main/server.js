"use strict";

const http = require("http");
const app = require("./index");
const paymentService = require("modules/payment/services/paymentService");
// Chỉnh đường dẫn cho khớp project của bạn:
const { sequelize } = require("models");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const EXPIRE_JOB_INTERVAL_MS = 5 * 60 * 1000;
const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = http.createServer(app);
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

// ---------------------------------------------------------------------
// Cron: dọn đơn hết hạn (chống chạy chồng)
// ---------------------------------------------------------------------
let expireJobRunning = false;
let expireTimer = null;

async function runExpireJob() {
  if (expireJobRunning) {
    console.warn("[Cron] Lần chạy trước chưa xong, bỏ qua tick này.");
    return;
  }
  expireJobRunning = true;
  const startedAt = Date.now();
  try {
    await paymentService.expireStaleOrders();
    console.log(`[Cron] expireStaleOrders OK (${Date.now() - startedAt}ms)`);
  } catch (err) {
    console.error("[Cron] expireStaleOrders lỗi:", err);
  } finally {
    expireJobRunning = false;
  }
}

// ---------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[server] Port ${PORT} đang bị chiếm. Chạy "npm run start:clean" hoặc đổi PORT trong .env.`);
  } else if (err.code === "EACCES") {
    console.error(`[server] Không đủ quyền bind port ${PORT}.`);
  } else {
    console.error("[server] Lỗi khởi động:", err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT} (pid ${process.pid})`);
  expireTimer = setInterval(runExpireJob, EXPIRE_JOB_INTERVAL_MS);
  console.log("[Cron] Expire stale orders job scheduled (every 5 min).");
});

let shuttingDown = false;

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[server] Nhận ${signal}, đang shutdown...`);

  const forceTimer = setTimeout(() => {
    console.error("[server] Shutdown quá thời gian, ép thoát.");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceTimer.unref();

  try {
    clearInterval(expireTimer);
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
    server.closeAllConnections?.();
    await sequelize.close();
    console.log("[server] Shutdown hoàn tất.");
    process.exit(exitCode);
  } catch (err) {
    console.error("[server] Lỗi khi shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("[process] unhandledRejection:", reason);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (err) => {
  console.error("[process] uncaughtException:", err);
  shutdown("uncaughtException", 1);
});