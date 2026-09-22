const { BodyWithLocale } = require("kernels/rules");

const cartValidation = {
  addItem: [
    new BodyWithLocale("product_id").notEmpty(),
    new BodyWithLocale("quantity").notEmpty().isInt({ min: 1 }),
  ],
  updateItem: [
    new BodyWithLocale("quantity").notEmpty().isInt({ min: 1 }),
  ],
};

module.exports = cartValidation;
