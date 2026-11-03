"use strict";

// 1. Khởi tạo bootstrap path resolver để các require từ thư mục gốc hoạt động ổn định trên mọi môi trường
require("./kernels/bootstrap");
require("dotenv").config();

const http = require("http");
const logger = require("./utils/logger");
const app = require("./index");
const paymentService = require("modules/payment/services/paymentService");
const { sequelize } = require("models");

const PORT = process.env.PORT || 3000;
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
    logger.warn("[Cron] Lần chạy trước chưa xong, bỏ qua tick này.");
    return;
  }
  expireJobRunning = true;
  const startedAt = Date.now();
  try {
    await paymentService.expireStaleOrders();
    logger.info(`[Cron] expireStaleOrders OK (${Date.now() - startedAt}ms)`);
  } catch (err) {
    logger.error("[Cron] expireStaleOrders lỗi:", err);
  } finally {
    expireJobRunning = false;
  }
}

// ---------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    logger.error(`[server] Port/Socket ${PORT} đang bị chiếm. Chạy "npm run start:clean" hoặc đổi PORT trong .env.`);
  } else if (err.code === "EACCES") {
    logger.error(`[server] Không đủ quyền bind port/socket ${PORT}.`);
  } else {
    logger.error("[server] Lỗi khởi động:", err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  const listenTarget = isNaN(Number(PORT)) ? PORT : `http://localhost:${PORT}`;
  logger.info(`[server] Running on ${listenTarget} (pid ${process.pid})`);
  expireTimer = setInterval(runExpireJob, EXPIRE_JOB_INTERVAL_MS);
  logger.info("[Cron] Expire stale orders job scheduled (every 5 min).");
});

let shuttingDown = false;

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`[server] Nhận ${signal}, đang shutdown...`);

  const forceTimer = setTimeout(() => {
    logger.error("[server] Shutdown quá thời gian, ép thoát.");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceTimer.unref();

  try {
    if (expireTimer) {
      clearInterval(expireTimer);
    }
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
    server.closeAllConnections?.();
    if (sequelize && typeof sequelize.close === "function") {
      try {
        await sequelize.close();
      } catch (dbErr) {
        logger.warn("[server] Không thể đóng kết nối DB khi shutdown:", dbErr.message);
      }
    }
    logger.info("[server] Shutdown hoàn tất.");
    process.exit(exitCode);
  } catch (err) {
    logger.error("[server] Lỗi khi shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  logger.error("[process] unhandledRejection:", reason);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (err) => {
  logger.error("[process] uncaughtException:", err);
  shutdown("uncaughtException", 1);
});
