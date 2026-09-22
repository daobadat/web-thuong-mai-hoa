const { BodyWithLocale } = require("kernels/rules");

const userValidation = {
  addAddress: [
    new BodyWithLocale("recipient_name").notEmpty(),
    new BodyWithLocale("recipient_phone").notEmpty(),
    new BodyWithLocale("address_line").notEmpty(),
    new BodyWithLocale("district").notEmpty(),
    new BodyWithLocale("city").notEmpty(),
  ],
};

module.exports = userValidation;
