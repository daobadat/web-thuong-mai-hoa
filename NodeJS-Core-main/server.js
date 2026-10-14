const logger = require('./utils/logger');
"use strict";

const http = require("http");
const app = require("./index");
const paymentService = require("modules/payment/services/paymentService");
// Chá»‰nh Ä‘Æ°á»ng dáº«n cho khá»›p project cá»§a báº¡n:
const { sequelize } = require("models");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const EXPIRE_JOB_INTERVAL_MS = 5 * 60 * 1000;
const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = http.createServer(app);
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

// ---------------------------------------------------------------------
// Cron: dá»n Ä‘Æ¡n háº¿t háº¡n (chá»‘ng cháº¡y chá»“ng)
// ---------------------------------------------------------------------
let expireJobRunning = false;
let expireTimer = null;

async function runExpireJob() {
  if (expireJobRunning) {
    logger.warn("[Cron] Láº§n cháº¡y trÆ°á»›c chÆ°a xong, bá» qua tick nÃ y.");
    return;
  }
  expireJobRunning = true;
  const startedAt = Date.now();
  try {
    await paymentService.expireStaleOrders();
    logger.info(`[Cron] expireStaleOrders OK (${Date.now() - startedAt}ms)`);
  } catch (err) {
    logger.error("[Cron] expireStaleOrders lá»—i:", err);
  } finally {
    expireJobRunning = false;
  }
}

// ---------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    logger.error(`[server] Port ${PORT} Ä‘ang bá»‹ chiáº¿m. Cháº¡y "npm run start:clean" hoáº·c Ä‘á»•i PORT trong .env.`);
  } else if (err.code === "EACCES") {
    logger.error(`[server] KhÃ´ng Ä‘á»§ quyá»n bind port ${PORT}.`);
  } else {
    logger.error("[server] Lá»—i khá»Ÿi Ä‘á»™ng:", err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  logger.info(`[server] Running on http://localhost:${PORT} (pid ${process.pid})`);
  expireTimer = setInterval(runExpireJob, EXPIRE_JOB_INTERVAL_MS);
  logger.info("[Cron] Expire stale orders job scheduled (every 5 min).");
});

let shuttingDown = false;

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`[server] Nháº­n ${signal}, Ä‘ang shutdown...`);

  const forceTimer = setTimeout(() => {
    logger.error("[server] Shutdown quÃ¡ thá»i gian, Ã©p thoÃ¡t.");
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
    logger.info("[server] Shutdown hoÃ n táº¥t.");
    process.exit(exitCode);
  } catch (err) {
    logger.error("[server] Lá»—i khi shutdown:", err);
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
