const { Coupon } = require("models");
const { Op } = require("sequelize");

const couponService = {
  list: async () => {
    return await Coupon.findAll({ order: [["valid_to", "DESC"]] });
  },

  getByCode: async (code) => {
    return await Coupon.findOne({ where: { code } });
  },

  /**
   * Validate and apply a coupon to a cart subtotal
   * Returns discount amount if valid
   */
  apply: async (code, subtotal) => {
    const coupon = await Coupon.findOne({
      where: {
        code,
        is_active: true,
        valid_from: { [Op.lte]: new Date() },
        valid_to: { [Op.gte]: new Date() },
      },
    });

    if (!coupon) {
      const error = new Error("Coupon is invalid or expired");
      error.statusCode = 400;
      throw error;
    }

    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      const error = new Error("Coupon usage limit reached");
      error.statusCode = 400;
      throw error;
    }

    if (parseFloat(subtotal) < parseFloat(coupon.min_order_amount)) {
      const error = new Error(
        `Minimum order amount is ${coupon.min_order_amount} VND for this coupon`
      );
      error.statusCode = 400;
      throw error;
    }

    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = (parseFloat(subtotal) * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount_amount));
      }
    } else {
      discountAmount = parseFloat(coupon.discount_value);
    }

    return {
      coupon_id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_amount: discountAmount,
    };
  },

  create: async (data) => {
    return await Coupon.create({
      code: data.code.toUpperCase(),
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      min_order_amount: data.min_order_amount || 0,
      max_discount_amount: data.max_discount_amount || null,
      usage_limit: data.usage_limit || null,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });
  },

  update: async (id, data) => {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }
    await coupon.update(data);
    return coupon;
  },

  delete: async (id) => {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }
    await coupon.destroy();
    return true;
  },
};

module.exports = couponService;
