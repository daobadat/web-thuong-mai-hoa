const { BodyWithLocale } = require("kernels/rules");

const reviewValidation = {
  create: [
    new BodyWithLocale("product_id").notEmpty(),
    new BodyWithLocale("rating").notEmpty().isInt({ min: 1, max: 5 }),
  ],
};

module.exports = reviewValidation;
