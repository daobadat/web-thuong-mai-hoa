require("dotenv").config({
  path: "./.env",
});
require("rootpath")();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("routes/api");
const { swaggerUIServe, swaggerUISetup } = require("kernels/api-docs");

const app = express();
app.disable("x-powered-by");

// =====================================================================
// CORS - Cho phép Angular frontend kết nối
// =====================================================================
const allowedOrigins = [
  "https://kflowervn.site",
  "https://www.kflowervn.site",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Kiểm tra origin có phải localhost (bất kỳ port nào) không
function isAllowedOrigin(origin) {
  if (!origin) return true; // Postman, curl, mobile apps
  if (allowedOrigins.includes(origin)) return true;
  // Cho phép mọi localhost port trong môi trường dev
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
  })
);

app.use(bodyParser.json());
app.use(express.json());

// =====================================================================
// API ROUTES
// =====================================================================
app.use("/", router);

// =====================================================================
// API DOCS (Swagger)
// =====================================================================
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

// =====================================================================
// SERVE ANGULAR FRONTEND (Production)
// =====================================================================
// Angular build được copy vào thư mục public/
const angularDistPath = path.join(__dirname, "public");
if (require("fs").existsSync(angularDistPath)) {
  app.use(express.static(angularDistPath));

  // Tất cả các route không khớp API → trả về index.html (SPA routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(angularDistPath, "index.html"));
  });
}

module.exports = app;
