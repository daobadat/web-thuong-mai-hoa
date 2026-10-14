require("dotenv").config();
require("rootpath")();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const router = require("routes/api");
const { swaggerUIServe, swaggerUISetup } = require("kernels/api-docs");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const logger = require("utils/logger");

const app = express();
app.disable("x-powered-by");

// Ghi log mọi request HTTP qua winston
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Bật các HTTP headers bảo mật
app.use(helmet({
  contentSecurityPolicy: false, // Tạm tắt CSP để không block script/style của Angular
}));

// Phòng chống XSS cơ bản (lọc payload req.body, req.query, req.params)
app.use(xss());

// Rate limit: chống brute force, spam API (100 req / 15 min / IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
// Chỉ áp dụng cho route API
app.use("/api", apiLimiter);

const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = new Set(
  [
    "https://kflowervn.site",
    "https://www.kflowervn.site",
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

const LOCALHOST_RE = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function isAllowedOrigin(origin) {
  if (!origin) return true; // Postman, curl, server-to-server
  if (allowedOrigins.has(origin)) return true;
  return !isProd && LOCALHOST_RE.test(origin);
}

app.use(
  cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
    maxAge: 600, // cache preflight 10 phút, giảm số request OPTIONS
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/api", router);
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

// /api/* không khớp -> 404 JSON, không rơi vào SPA fallback
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

const angularDistPath = path.join(__dirname, "public");
if (fs.existsSync(angularDistPath)) {
  app.use(express.static(angularDistPath, { maxAge: isProd ? "1d" : 0, index: false }));
  app.get("*", (req, res) => {
    res.sendFile(path.join(angularDistPath, "index.html"));
  });
}

// Error handler cuối cùng: tránh lộ stack trace
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`[error] ${req.method} ${req.originalUrl}: %O`, err);
  if (res.headersSent) return next(err);
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ message: status === 500 ? "Internal Server Error" : err.message });
});

module.exports = app;
