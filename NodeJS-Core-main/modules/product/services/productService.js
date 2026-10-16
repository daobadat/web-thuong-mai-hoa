const { Product, ProductTranslation, ProductImage, ProductVariant, Category, Occasion } = require("models");
const { Op } = require("sequelize");

const productService = {
  list: async (query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const offset = (page - 1) * limit;
    const lang = query.lang || "vi";

    const whereClause = { is_active: true };

    if (query.category_id) {
      whereClause.category_id = query.category_id;
    }

    if (query.min_price || query.max_price) {
      whereClause.base_price = {};
      if (query.min_price) whereClause.base_price[Op.gte] = query.min_price;
      if (query.max_price) whereClause.base_price[Op.lte] = query.max_price;
    }

    const translationWhere = { language_code: lang };
    if (query.search) {
      translationWhere.name = { [Op.like]: `%${query.search}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProductTranslation,
          as: "translations",
          where: translationWhere,
          required: query.search ? true : false,
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
          through: { attributes: [] }, // Don't need junction table attributes
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      products: rows,
    };
  },

  getById: async (id, lang = "vi") => {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductTranslation,
          as: "translations",
          where: { language_code: lang },
          required: false,
        },
        {
          model: ProductImage,
          as: "images",
        },
        {
          model: ProductVariant,
          as: "variants",
          where: { is_active: true },
          required: false,
        },
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return product;
  },

  create: async (data) => {
    const product = await Product.create({
      sku: data.sku,
      category_id: data.category_id,
      base_price: data.base_price,
      currency: data.currency || "VND",
      stock_quantity: data.stock_quantity || 0,
      is_preorder: data.is_preorder || false,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    if (data.translations && Array.isArray(data.translations)) {
      for (const t of data.translations) {
        if (t.name) {
          await ProductTranslation.create({
            product_id: product.id,
            language_code: t.language_code || "vi",
            name: t.name,
            description: t.description || "",
            care_instructions: t.care_instructions || "",
          });
        }
      }
    } else if (data.name) {
      await ProductTranslation.create({
        product_id: product.id,
        language_code: data.language_code || "vi",
        name: data.name,
        description: data.description || "",
        care_instructions: data.care_instructions || "",
      });
    }

    if (data.images && Array.isArray(data.images)) {
      for (let img of data.images) {
        await ProductImage.create({
          product_id: product.id,
          url: img.url,
          is_primary: img.is_primary || false,
          display_order: img.display_order || 0,
        });
      }
    }

    if (data.occasion_ids && Array.isArray(data.occasion_ids)) {
      await product.setOccasions(data.occasion_ids);
    }

    return productService.getById(product.id, data.language_code || "vi");
  },

  update: async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    await product.update(data);

    if (data.translations && Array.isArray(data.translations)) {
      for (const t of data.translations) {
        if (t.name) {
          const [translation] = await ProductTranslation.findOrCreate({
            where: { product_id: id, language_code: t.language_code || "vi" },
            defaults: {
              name: t.name,
              description: t.description || "",
              care_instructions: t.care_instructions || "",
            },
          });
          if (translation) {
            await translation.update({
              name: t.name,
              description: t.description !== undefined ? t.description : translation.description,
              care_instructions: t.care_instructions !== undefined ? t.care_instructions : translation.care_instructions,
            });
          }
        }
      }
    } else if (data.name) {
      const [translation] = await ProductTranslation.findOrCreate({
        where: { product_id: id, language_code: data.language_code || "vi" },
        defaults: {
          name: data.name,
          description: data.description || "",
          care_instructions: data.care_instructions || "",
        },
      });
      if (translation) {
        await translation.update({
          name: data.name,
          description: data.description !== undefined ? data.description : translation.description,
          care_instructions: data.care_instructions !== undefined ? data.care_instructions : translation.care_instructions,
        });
      }
    }

    if (data.occasion_ids !== undefined) {
      await product.setOccasions(data.occasion_ids);
    }

    if (data.images && Array.isArray(data.images)) {
      await ProductImage.destroy({ where: { product_id: id } });
      for (let img of data.images) {
        if (img && img.url) {
          await ProductImage.create({
            product_id: id,
            url: img.url,
            is_primary: img.is_primary !== undefined ? img.is_primary : true,
            display_order: img.display_order || 0,
          });
        }
      }
    } else if (data.img && typeof data.img === "string") {
      await ProductImage.destroy({ where: { product_id: id } });
      await ProductImage.create({
        product_id: id,
        url: data.img,
        is_primary: true,
        display_order: 0,
      });
    }

    return productService.getById(id, data.language_code || "vi");
  },

  delete: async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    await ProductTranslation.destroy({ where: { product_id: id } });
    await ProductImage.destroy({ where: { product_id: id } });
    await ProductVariant.destroy({ where: { product_id: id } });
    await product.destroy();
    return true;
  },

  suggest: async ({ keyword, lang = "vi", limit = 8 }) => {
    const cleanKeyword = (keyword || "").trim();
    if (!cleanKeyword || cleanKeyword.length < 2) {
      return [];
    }

    const escapedKeyword = cleanKeyword.replace(/[%_\\]/g, "\\$&");
    const maxLimit = Math.min(Math.max(parseInt(limit, 10) || 8, 1), 10);

    // Tìm tất cả sản phẩm is_active = true có bản dịch (ở bất kỳ ngôn ngữ nào) chứa từ khóa
    const matchingTranslations = await ProductTranslation.findAll({
      where: {
        name: { [Op.like]: `%${escapedKeyword}%` },
      },
      attributes: ["product_id"],
      raw: true,
    });

    const productIds = [...new Set(matchingTranslations.map((t) => t.product_id))];
    if (productIds.length === 0) {
      return [];
    }

    const products = await Product.findAll({
      where: {
        id: { [Op.in]: productIds },
        is_active: true,
      },
      include: [
        {
          model: ProductTranslation,
          as: "translations",
          required: false,
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
        },
      ],
    });

    const slugify = require("slugify");

    // Format và chuẩn hóa kết quả
    const items = products.map((p) => {
      const transCurrent = p.translations?.find((t) => t.language_code === lang);
      const transFallback = p.translations?.find((t) => t.language_code !== lang) || p.translations?.[0];
      const name = transCurrent?.name || transFallback?.name || p.sku;
      const primaryImg = p.images?.find((img) => img.is_primary) || p.images?.[0];
      const slug = slugify(name, { lower: true, locale: "vi", remove: /[*+~.()'"!:@]/g });

      return {
        id: p.id,
        name,
        slug,
        price: Number(p.base_price),
        is_in_stock: p.stock_quantity > 0,
        image: primaryImg?.url || "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=120&h=120&fit=crop",
      };
    });

    // Sắp xếp:
    // 1. Tên bắt đầu bằng từ khóa lên trước
    // 2. Sau đó theo thứ tự chữ cái (localeCompare)
    const lowerKeyword = cleanKeyword.toLowerCase();
    items.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(lowerKeyword);
      const bStarts = b.name.toLowerCase().startsWith(lowerKeyword);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name, lang === "ko" ? "ko" : "vi");
    });

    return items.slice(0, maxLimit);
  },
};

module.exports = productService;
