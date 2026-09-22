const { Wishlist, Product, ProductTranslation, ProductImage } = require("models");

const wishlistService = {
  list: async (userId, lang = "vi") => {
    return await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
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
              where: { is_primary: true },
              required: false,
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  },

  add: async (userId, productId) => {
    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const [wishlist, created] = await Wishlist.findOrCreate({
      where: { user_id: userId, product_id: productId },
    });

    return { wishlist, created };
  },

  remove: async (userId, productId) => {
    const deleted = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId },
    });

    if (!deleted) {
      const error = new Error("Product not found in wishlist");
      error.statusCode = 404;
      throw error;
    }

    return true;
  },
};

module.exports = wishlistService;
