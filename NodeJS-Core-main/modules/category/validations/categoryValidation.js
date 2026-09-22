const { BodyWithLocale } = require("kernels/rules");

const categoryValidation = {
  create: [
    new BodyWithLocale("slug").notEmpty(),
    new BodyWithLocale("name").notEmpty(),
  ],
};

module.exports = categoryValidation;
