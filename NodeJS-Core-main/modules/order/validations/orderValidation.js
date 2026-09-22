const { BodyWithLocale } = require("kernels/rules");

const orderValidation = {
  checkout: [
    new BodyWithLocale("recipient_name").notEmpty(),
    new BodyWithLocale("recipient_phone").notEmpty(),
    new BodyWithLocale("delivery_address").notEmpty(),
  ],
  updateStatus: [
    new BodyWithLocale("status").notEmpty(),
  ],
};

module.exports = orderValidation;
