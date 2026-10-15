const { BodyWithLocale } = require("kernels/rules");

const productValidation = {
  create: [
    new BodyWithLocale("sku").notEmpty(),
    new BodyWithLocale("category_id").notEmpty(),
    new BodyWithLocale("base_price").notEmpty().isNumeric(),
  ],
};

module.exports = productValidation;
