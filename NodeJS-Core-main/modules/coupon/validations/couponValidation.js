const { BodyWithLocale } = require("kernels/rules");

const couponValidation = {
  create: [
    new BodyWithLocale("code").notEmpty(),
    new BodyWithLocale("discount_type").notEmpty(),
    new BodyWithLocale("discount_value").notEmpty().isNumeric(),
    new BodyWithLocale("valid_from").notEmpty(),
    new BodyWithLocale("valid_to").notEmpty(),
  ],
  apply: [
    new BodyWithLocale("code").notEmpty(),
  ],
};

module.exports = couponValidation;
