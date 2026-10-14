const axios = require("axios");
const { Product, ProductTranslation, ProductImage, Category, Occasion, ChatbotConversation, ChatbotMessage } = require("models");
const { Op } = require("sequelize");
const logger = require("utils/logger");

let cachedCatalog = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 phút cache catalog

class AiChatService {
  /**
   * Lấy danh sách sản phẩm đang hoạt động để làm dữ liệu ngữ cảnh cho AI
   */
  async getCatalogContext() {
    const now = Date.now();
    if (cachedCatalog && now - lastCacheTime < CACHE_TTL_MS) {
      return cachedCatalog;
    }

    try {
      const products = await Product.findAll({
        where: { is_active: true },
        include: [
          {
            model: ProductTranslation,
            as: "translations",
            required: false,
          },
          {
            model: ProductImage,
            as: "images",
            where: { is_primary: true },
            required: false,
          },
          {
            model: Category,
            as: "category",
            required: false,
          },
          {
            model: Occasion,
            as: "occasions",
            required: false,
            through: { attributes: [] },
          },
        ],
        order: [["created_at", "DESC"]],
        limit: 50,
      });

      const formatted = products.map((p) => {
        const vi = p.translations?.find((t) => t.language_code === "vi");
        const ko = p.translations?.find((t) => t.language_code === "ko");
        const img = p.images && p.images.length > 0 ? p.images[0].url : "";

        return {
          id: p.id,
          sku: p.sku,
          price: Number(p.base_price),
          stock: p.stock_quantity,
          category: p.category?.slug || "",
          occasions: p.occasions ? p.occasions.map((o) => o.slug) : [],
          nameVi: vi?.name || p.sku,
          nameKo: ko?.name || "",
          descVi: vi?.description || "",
          meaningVi: vi?.flower_meaning || "",
          img: img,
        };
      });

      cachedCatalog = formatted;
      lastCacheTime = now;
      return formatted;
    } catch (err) {
      logger.error("[AiChatService] Lỗi lấy catalog:", err);
      return cachedCatalog || [];
    }
  }

  /**
   * Tạo prompt hệ thống bao gồm thông tin cửa hàng và catalog
   */
  buildSystemPrompt(catalog, lang = "vi") {
    const catalogSummary = catalog
      .map(
        (p) =>
          `- [ID: ${p.id}] Tên: ${p.nameVi} (Hàn: ${p.nameKo || "N/A"}) | Giá: ${p.price.toLocaleString("vi-VN")}đ | Loại: ${p.category} | Dịp: ${p.occasions.join(", ")} | Ý nghĩa: ${p.meaningVi || p.descVi}`
      )
      .join("\n");

    return `Bạn là "KFlower AI" - Chuyên gia tư vấn hoa nghệ thuật thông minh và tận tâm của tiệm hoa KFlowerVN (kflowervn.site).
Nhiệm vụ của bạn:
1. Tư vấn chọn hoa phù hợp cho khách hàng dựa trên dịp (Sinh nhật, Tỏ tình/Tình yêu, Kỷ niệm, Khai trương, Chia buồn, Ngày lễ 8/3, 20/10, Valentine...) hoặc ngân sách, đối tượng nhận hoa (bạn gái, mẹ, sếp, đồng nghiệp, đối tác...).
2. Am hiểu sâu sắc về ý nghĩa các loài hoa (hoa hồng, tulip, hướng dương, cẩm tú cầu, baby, lan hồ điệp...).
3. Nắm rõ chính sách cửa hàng:
   - Giao hoa siêu tốc trong 2 giờ nội thành.
   - Miễn phí thiệp viết tay / banner chúc mừng thiết kế riêng.
   - Hỗ trợ đổi mới 100% nếu hoa bị hỏng hoặc sai mẫu khi nhận.
   - Thanh toán đa dạng: VietQR (chuyển khoản), MoMo, VNPay, COD (tiền mặt).
4. QUAN TRỌNG VỀ SẢN PHẨM:
   - Hãy ưu tiên giới thiệu từ 1 đến 3 sản phẩm có thật trong danh sách sản phẩm dưới đây nếu phù hợp với yêu cầu của khách.
   - Nếu bạn gợi ý sản phẩm cụ thể, ở cuối câu trả lời hãy gắn một dòng đặc biệt dạng:
     [RECOMMENDED_IDS: id1, id2]
     (thay id1, id2 bằng đúng ID của sản phẩm trong danh mục dưới đây để hệ thống hiển thị thẻ hoa tương tác cho khách).
5. Phong cách trả lời:
   - Lịch sự, ấm áp, tươi vui, dùng biểu tượng cảm xúc (🌸, 💐, 🌹, ✨) nhẹ nhàng tinh tế.
   - Ngắn gọn, súc tích, đi thẳng vào trọng tâm, không lan man quá dài.
   - Ngôn ngữ: Nếu khách hỏi bằng tiếng Việt -> trả lời tiếng Việt chuẩn. Nếu khách hỏi bằng tiếng Hàn -> trả lời bằng tiếng Hàn (한국어). Nếu hỏi tiếng Anh -> trả lời tiếng Anh.

DANH SÁCH HOA HIỆN CÓ CỦA CỬA HÀNG:
${catalogSummary}
`;
  }

  /**
   * Gọi Google Gemini API
   */
  async callGeminiApi(apiKey, systemPrompt, userMessage, history = []) {
    // Model Gemini 1.5 flash hoặc 2.0 flash
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Chuyển đổi lịch sử chat cho Gemini format
    const contents = [];

    // System instruction được truyền qua systemInstruction hoặc turn đầu tiên
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt + "\n\nBắt đầu cuộc trò chuyện. Hãy chào và lắng nghe yêu cầu của tôi." }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Dạ em chào anh/chị! Em là trợ lý KFlower AI. Hôm nay anh/chị đang tìm mẫu hoa xinh đẹp cho dịp đặc biệt nào ạ? 🌸" }],
    });

    // Thêm các lượt chat trước (nếu có, tối đa 6 tin nhắn gần nhất)
    const recentHistory = (history || []).slice(-6);
    for (const msg of recentHistory) {
      if (msg.role === "user" || msg.role === "assistant" || msg.role === "model") {
        contents.push({
          role: msg.role === "assistant" ? "model" : msg.role,
          parts: [{ text: msg.text || msg.content || "" }],
        });
      }
    }

    // Thêm câu hỏi hiện tại
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      },
      { timeout: 15000 }
    );

    const candidate = response.data?.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text || "";
    return replyText;
  }

  /**
   * Fallback engine: Khi chưa có GEMINI_API_KEY hoặc khi Gemini API lỗi mạng/quota
   */
  fallbackResponse(catalog, message, lang = "vi") {
    const text = message.toLowerCase();
    let reply = "";
    let recommended = [];

    const isKo = lang === "ko" || /[\uAC00-\uD7AF]/.test(message);

    // 1. Dịp Sinh nhật
    if (text.includes("sinh nhật") || text.includes("birthday") || text.includes("생일")) {
      recommended = catalog.filter((p) => p.occasions.includes("sinh-nhat") || p.occasions.includes("tinh-yeu")).slice(0, 3);
      if (isKo) {
        reply = "생일을 축하하기 위해 가장 화사하고 로맨틱한 꽃들을 추천해 드릴게요! 🌸\nKFlower에서는 특별한 손편지 카드와 고급 포장 서비스를 무료로 제공해 드립니다.";
      } else {
        reply = "Để mừng sinh nhật thêm rạng rỡ và ý nghĩa, em xin gợi ý những mẫu hoa tươi thắm, tone màu ngọt ngào được yêu thích nhất tại KFlowerVN ạ! 🌸\nShop tặng kèm thiệp viết tay xinh xắn và giao tận nơi hỏa tốc trong 2 giờ.";
      }
    }
    // 2. Dịp Tình yêu / Tỏ tình / Người yêu / Valentine
    else if (text.includes("người yêu") || text.includes("bạn gái") || text.includes("tỏ tình") || text.includes("tình yêu") || text.includes("kỷ niệm") || text.includes("valentine") || text.includes("연인") || text.includes("여자친구") || text.includes("기념일")) {
      recommended = catalog.filter((p) => p.occasions.includes("tinh-yeu") || p.nameVi.toLowerCase().includes("hồng")).slice(0, 3);
      if (isKo) {
        reply = "사랑하는 연인을 위한 로맨틱하고 우아한 장미 및 플라워 박스를 추천합니다. 💖\n마음을 전하는 감동적인 선물이 될 거예요.";
      } else {
        reply = "Một bó hoa hồng nhung đỏ thắm hoặc hoa pastel ngọt ngào sẽ là món quà tuyệt vời nhất để bày tỏ tình cảm với người thương! 💖\nEm gợi ý những mẫu hoa lãng mạn này dành riêng cho bạn:";
      }
    }
    // 3. Khai trương / Chúc mừng / Đối tác
    else if (text.includes("khai trương") || text.includes("chúc mừng") || text.includes("hồng phát") || text.includes("đối tác") || text.includes("개업") || text.includes("축하")) {
      recommended = catalog.filter((p) => p.occasions.includes("khai-truong") || p.category === "ke-hoa" || p.category === "gio-hoa").slice(0, 3);
      if (isKo) {
        reply = "성공과 번영을 기원하는 품격 있는 개업 축하 화환과 화구니입니다. 🌟\n무료 맞춤형 리본 배너를 정성껏 제작해 드립니다.";
      } else {
        reply = "Chúc mừng khai trương hồng phát! Những kệ hoa và giỏ hoa rực rỡ sắc vàng, đỏ sẽ mang lại may mắn, tài lộc dồi dào cho gia chủ ạ! 🌟\nKFlowerVN hỗ trợ in băng rôn chúc mừng sang trọng miễn phí.";
      }
    }
    // 4. Chia buồn / Viếng
    else if (text.includes("chia buồn") || text.includes("viếng") || text.includes("tang") || text.includes("장례") || text.includes("조문")) {
      recommended = catalog.filter((p) => p.occasions.includes("chia-buon") || p.category === "ke-hoa").slice(0, 2);
      if (isKo) {
        reply = "삼가 고인의 명복을 빌며, 정성을 담은 조문 화환을 준비해 드립니다. 경건하고 품격 있게 배송해 드립니다.";
      } else {
        reply = "KFlowerVN xin chia sẻ nỗi buồn cùng gia quyến. Những kệ hoa chia buồn tone trắng, tím thanh tịnh thể hiện sự kính trọng và tiếc thương sâu sắc nhất ạ.";
      }
    }
    // 5. Giá rẻ / Dưới 500k
    else if (text.includes("dưới 500") || text.includes("500k") || text.includes("giá rẻ") || text.includes("tiết kiệm") || text.includes("저렴") || text.includes("50만")) {
      recommended = catalog.filter((p) => p.price <= 550000).slice(0, 3);
      if (isKo) {
        reply = "50만동 이하의 가성비 좋고 아름다운 꽃다발들을 준비했습니다. 부담 없이 감동을 전해보세요! 💐";
      } else {
        reply = "Dạ với ngân sách tiết kiệm dưới 500k, KFlowerVN có rất nhiều mẫu hoa xinh xắn, thiết kế chỉn chu và hoa tươi loại 1 dành cho bạn đây ạ! 💐";
      }
    }
    // 6. Giao hàng / Thời gian / Phí ship
    else if (text.includes("giao hàng") || text.includes("ship") || text.includes("bao lâu") || text.includes("thời gian") || text.includes("배송") || text.includes("시간")) {
      if (isKo) {
        reply = "🚚 **KFlowerVN 배송 안내:**\n- 도심 내 2시간 이내 빠른 특급 배송\n- 주문 시 원하는 배송 시간대 지정 가능\n- 배송 전 완성된 실제 꽃 사진 확인 서비스 제공\n- 50만동 이상 주문 시 무료 배송 지원!";
      } else {
        reply = "🚚 **Chính sách giao hàng của KFlowerVN:**\n- Giao hỏa tốc trong 2 giờ tại nội thành.\n- Quý khách có thể chọn chính xác khung giờ giao hoa theo ý muốn khi thanh toán.\n- Chụp ảnh hoa thực tế gửi quý khách duyệt trước khi giao.\n- Miễn phí vận chuyển cho đơn hàng từ 500.000đ!";
      }
      recommended = catalog.slice(0, 2);
    }
    // Mặc định
    else {
      recommended = catalog.slice(0, 3);
      if (isKo) {
        reply = `안녕하세요! KFlowerVN AI 어시스턴트입니다. 🌸\n원하시는 꽃의 종류, 선물하시는 행사(생일, 기념일, 개업 등), 또는 예산을 말씀해 주시면 딱 맞는 꽃을 추천해 드릴게요!`;
      } else {
        reply = `Dạ em chào anh/chị! KFlowerVN có rất nhiều mẫu hoa tươi nghệ thuật cho sinh nhật, kỷ niệm, tỏ tình, khai trương... ✨\nAnh/chị có thể cho em biết dịp tặng, màu sắc yêu thích hoặc ngân sách dự kiến để em tư vấn mẫu hoa ưng ý nhất nhé! 💐`;
      }
    }

    if (recommended.length === 0) {
      recommended = catalog.slice(0, 3);
    }

    return {
      reply,
      recommendedProducts: recommended,
    };
  }

  /**
   * Lưu phiên và tin nhắn vào database (chatbot_conversations & chatbot_messages)
   */
  async recordConversation(userId, sessionId, lang, userMessage, botReply) {
    try {
      let conversation = null;
      if (userId) {
        conversation = await ChatbotConversation.findOne({
          where: { user_id: userId, ended_at: null },
          order: [["started_at", "DESC"]],
        });
      } else if (sessionId) {
        conversation = await ChatbotConversation.findOne({
          where: { session_id: sessionId, ended_at: null },
          order: [["started_at", "DESC"]],
        });
      }

      if (!conversation) {
        conversation = await ChatbotConversation.create({
          user_id: userId || null,
          session_id: sessionId || null,
          language: lang || "vi",
        });
      }

      await ChatbotMessage.bulkCreate([
        {
          conversation_id: conversation.id,
          role: "user",
          content: userMessage,
        },
        {
          conversation_id: conversation.id,
          role: "assistant",
          content: botReply,
        },
      ]);
    } catch (err) {
      logger.error("[AiChatService] Lỗi lưu hội thoại vào DB:", err.message);
    }
  }

  /**
   * Xử lý tin nhắn chat từ khách hàng
   */
  async handleChat({ message, history = [], lang = "vi", userId = null, sessionId = null }) {
    if (!message || typeof message !== "string" || !message.trim()) {
      throw new Error("Tin nhắn không hợp lệ");
    }

    const cleanMessage = message.trim();
    const catalog = await this.getCatalogContext();
    const apiKey = process.env.GEMINI_API_KEY;

    let result;

    // Nếu không có API Key, dùng ngay Fallback Engine thông minh
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
      logger.info("[AiChat] Không tìm thấy GEMINI_API_KEY, chuyển sang Smart Rule-based Fallback.");
      result = this.fallbackResponse(catalog, cleanMessage, lang);
    } else {
      try {
        const systemPrompt = this.buildSystemPrompt(catalog, lang);
        const rawReply = await this.callGeminiApi(apiKey, systemPrompt, cleanMessage, history);

        // Phân tích [RECOMMENDED_IDS: ...] nếu Gemini trả về
        let cleanReply = rawReply;
        let recommendedProducts = [];

        const regex = /\[RECOMMENDED_IDS:\s*([^\]]+)\]/i;
        const match = rawReply.match(regex);

        if (match) {
          cleanReply = rawReply.replace(regex, "").trim();
          const ids = match[1]
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);

          recommendedProducts = catalog.filter((p) => ids.includes(String(p.id)));
        }

        // Nếu Gemini không trả về tag nhưng trong bài có nhắc tên sản phẩm, tìm sản phẩm tương ứng
        if (recommendedProducts.length === 0) {
          const lowerReply = rawReply.toLowerCase();
          recommendedProducts = catalog
            .filter(
              (p) =>
                (p.nameVi && lowerReply.includes(p.nameVi.toLowerCase())) ||
                (p.nameKo && lowerReply.includes(p.nameKo.toLowerCase()))
            )
            .slice(0, 3);
        }

        // Nếu vẫn chưa có và người dùng đang hỏi tìm mua hoa, lấy 2-3 sản phẩm phù hợp
        if (
          recommendedProducts.length === 0 &&
          (cleanMessage.toLowerCase().includes("hoa") ||
            cleanMessage.toLowerCase().includes("mua") ||
            cleanMessage.toLowerCase().includes("tặng") ||
            cleanMessage.toLowerCase().includes("giá"))
        ) {
          recommendedProducts = catalog.slice(0, 3);
        }

        result = {
          reply: cleanReply,
          recommendedProducts,
        };
      } catch (err) {
        logger.error("[AiChat] Gemini API lỗi, fallback sang smart catalog:", err.message);
        result = this.fallbackResponse(catalog, cleanMessage, lang);
      }
    }

    // Ghi nhận hội thoại vào DB
    if (userId || sessionId) {
      await this.recordConversation(userId, sessionId, lang, cleanMessage, result.reply);
    }

    return result;
  }

  /**
   * Lấy danh sách câu gợi ý nhanh
   */
  getSuggestions(lang = "vi") {
    if (lang === "ko") {
      return [
        { label: "🌸 생일 축하 꽃 추천", prompt: "생일 축하용으로 인기 있는 꽃 추천해 줘" },
        { label: "💖 여자친구를 위한 로맨틱 꽃", prompt: "여자친구에게 선물할 감동적인 꽃 추천해 줘" },
        { label: "💰 50만동 이하 예쁜 꽃", prompt: "50만동 이하로 가성비 좋은 꽃 있어?" },
        { label: "🎉 개업 축하 화환", prompt: "개업 축하용 화환이나 화구니 추천해 줘" },
        { label: "🚚 배송 정책 및 소요 시간", prompt: "배송은 얼마나 걸리고 배송비는 얼마야?" },
      ];
    }

    return [
      { label: "🌸 Tư vấn hoa sinh nhật", prompt: "Gợi ý cho mình mẫu hoa tặng sinh nhật đẹp và ý nghĩa nhé" },
      { label: "💖 Hoa tặng người yêu", prompt: "Mình muốn tìm hoa lãng mạn tặng bạn gái, mẫu nào hot nhất?" },
      { label: "💰 Hoa đẹp dưới 500k", prompt: "Shop có mẫu hoa nào giá hạt dẻ dưới 500k không?" },
      { label: "🎉 Hoa khai trương hồng phát", prompt: "Tư vấn cho mình kệ hoa hoặc giỏ hoa mừng khai trương đối tác" },
      { label: "🚚 Thời gian giao hàng & phí ship", prompt: "Giao hoa mất bao lâu và phí ship tính như thế nào?" },
    ];
  }
}

module.exports = new AiChatService();
