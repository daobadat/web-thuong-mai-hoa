const aiChatService = require("modules/ai-chat/services/aiChatService");
const responseUtils = require("utils/responseUtils");

const aiChatController = {
  chat: async (req, res) => {
    try {
      const { message, history, lang } = req.body;
      const userId = req.user?.id || null;
      const sessionId = req.headers["x-session-id"] || null;

      if (!message || typeof message !== "string" || !message.trim()) {
        return responseUtils.badRequest(res, "Vui lòng nhập tin nhắn");
      }

      const result = await aiChatService.handleChat({
        message,
        history,
        lang: lang || "vi",
        userId,
        sessionId,
      });

      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message || "Lỗi xử lý tin nhắn chat");
    }
  },

  suggestions: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const suggestions = aiChatService.getSuggestions(lang);
      return responseUtils.ok(res, suggestions);
    } catch (err) {
      return responseUtils.error(res, err.message || "Lỗi lấy danh sách gợi ý");
    }
  },
};

module.exports = aiChatController;
