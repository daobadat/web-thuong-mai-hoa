const { ProductReview, User, Product, ProductTranslation, OrderItem } = require("models");
const { Op } = require("sequelize");

const reviewService = {
  listByProduct: async (productId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await ProductReview.findAndCountAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      reviews: rows,
    };
  },

  create: async (userId, data) => {
    const { product_id, order_item_id, rating, comment } = data;

    // Kiểm tra đã review chưa (nếu có order_item_id)
    if (order_item_id) {
      const existing = await ProductReview.findOne({
        where: { user_id: userId, order_item_id },
      });
      if (existing) {
        const error = new Error("You have already reviewed this order item");
        error.statusCode = 400;
        throw error;
      }
    }

    // Kiểm tra product tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    // Xác định is_verified_purchase
    let isVerifiedPurchase = false;
    if (order_item_id) {
      const orderItem = await OrderItem.findOne({
        where: { id: order_item_id, product_id },
      });
      isVerifiedPurchase = !!orderItem;
    }

    const review = await ProductReview.create({
      product_id,
      user_id: userId,
      order_item_id: order_item_id || null,
      rating,
      comment: comment || null,
      is_verified_purchase: isVerifiedPurchase,
    });

    // Cập nhật avg_rating và review_count trên product
    const allReviews = await ProductReview.findAll({
      where: { product_id },
      attributes: ["rating"],
    });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await product.update({
      avg_rating: Math.round(avg * 100) / 100,
      review_count: allReviews.length,
    });

    return review;
  },

  delete: async (userId, reviewId, isAdmin = false) => {
    const where = { id: reviewId };
    if (!isAdmin) where.user_id = userId;

    const review = await ProductReview.findOne({ where });
    if (!review) {
      const error = new Error("Review not found or unauthorized");
      error.statusCode = 404;
      throw error;
    }

    const { product_id } = review;
    await review.destroy();

    // Cập nhật lại avg_rating sau khi xóa
    const allReviews = await ProductReview.findAll({
      where: { product_id },
      attributes: ["rating"],
    });
    const product = await Product.findByPk(product_id);
    if (product) {
      const avg = allReviews.length
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;
      await product.update({
        avg_rating: Math.round(avg * 100) / 100,
        review_count: allReviews.length,
      });
    }

    return true;
  },
};

module.exports = reviewService;
