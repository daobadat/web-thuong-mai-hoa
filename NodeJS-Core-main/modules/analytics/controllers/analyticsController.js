"use strict";

const analyticsService = require("modules/analytics/services/analyticsService");
const responseUtils = require("utils/responseUtils");
const logger = require("utils/logger");

const ALLOWED_MONTHS = [3, 6, 12];
const ALLOWED_LANGS = ["vi", "ko"];

const analyticsController = {
  getStats: async (req, res) => {
    try {
      const months = req.query.months ? parseInt(req.query.months, 10) : 6;
      const lang = (req.query.lang || "vi").toLowerCase();

      if (!ALLOWED_MONTHS.includes(months)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Tham số months không hợp lệ (chỉ nhận 3, 6 hoặc 12)",
        });
      }

      if (!ALLOWED_LANGS.includes(lang)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Tham số lang không hợp lệ (chỉ nhận vi hoặc ko)",
        });
      }

      const stats = await analyticsService.getStats({ months, lang });
      return responseUtils.ok(res, stats);
    } catch (err) {
      logger.error(
        `[Analytics] Lỗi khi lấy thống kê (user: ${req.user?.userId || "unknown"}):`,
        err
      );
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Lỗi hệ thống khi tải dữ liệu thống kê",
      });
    }
  },
};

module.exports = analyticsController;
