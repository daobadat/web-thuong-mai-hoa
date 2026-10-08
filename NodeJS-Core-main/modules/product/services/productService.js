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

    if (data.name) {
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

    if (data.name) {
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
};

module.exports = productService;
