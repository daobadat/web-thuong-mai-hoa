const { BodyWithLocale } = require("kernels/rules");

const authValidation = {
  register: [
    new BodyWithLocale("email").notEmpty().isEmail(),
    new BodyWithLocale("password").notEmpty().isLength({ min: 6 }),
    new BodyWithLocale("full_name").notEmpty(),
  ],
  login: [
    new BodyWithLocale("email").notEmpty().isEmail(),
    new BodyWithLocale("password").notEmpty(),
  ],
};

module.exports = authValidation;
