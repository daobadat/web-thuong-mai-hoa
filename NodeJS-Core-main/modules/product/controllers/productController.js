const productService = require("modules/product/services/productService");
const responseUtils = require("utils/responseUtils");

// In-memory cache for search suggestions (30 seconds TTL)
const suggestCache = new Map();
const CACHE_TTL_MS = 30 * 1000;

const productController = {
  suggest: async (req, res) => {
    try {
      const keyword = (req.query.keyword || req.query.q || "").trim();
      const lang = req.query.lang || "vi";
      const limitRaw = req.query.limit;

      // Validation Step 3:
      // 1. Keyword: 2 to 60 characters
      if (keyword.length < 2 || keyword.length > 60) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Từ khóa tìm kiếm phải có độ dài từ 2 đến 60 ký tự.",
        });
      }

      // 2. Language: only 'vi' or 'ko'
      if (lang !== "vi" && lang !== "ko") {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Ngôn ngữ chỉ chấp nhận 'vi' hoặc 'ko'.",
        });
      }

      // 3. Limit: max 10
      let limit = 8;
      if (limitRaw !== undefined) {
        limit = parseInt(limitRaw, 10);
        if (isNaN(limit) || limit < 1 || limit > 10) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Số lượng kết quả gợi ý phải là số nguyên từ 1 đến 10.",
          });
        }
      }

      // Cache lookup
      const cacheKey = `${lang}:${keyword.toLowerCase()}:${limit}`;
      const cached = suggestCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return responseUtils.ok(res, cached.data);
      }

      const results = await productService.suggest({ keyword, lang, limit });

      // Save to cache
      suggestCache.set(cacheKey, {
        data: results,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      // Periodic cleanup of expired cache items
      if (suggestCache.size > 200) {
        const now = Date.now();
        for (const [key, val] of suggestCache.entries()) {
          if (val.expiresAt < now) suggestCache.delete(key);
        }
      }

      return responseUtils.ok(res, results);
    } catch (err) {
      console.error("[Product Suggest Error]:", err);
      // Ghi log ở server, trả thông báo chung cho client
      return responseUtils.error(res, "Không thể tải gợi ý tìm kiếm vào lúc này.");
    }
  },

  index: async (req, res) => {
    try {
      const result = await productService.list(req.query);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const product = await productService.getById(req.params.id, lang);
      if (!product) {
        return responseUtils.notFound(res);
      }
      return responseUtils.ok(res, product);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const result = await productService.create(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await productService.update(req.params.id, req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await productService.delete(req.params.id);
      return responseUtils.ok(res, { message: "Product deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = productController;
