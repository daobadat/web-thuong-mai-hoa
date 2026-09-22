const { BodyWithLocale } = require("kernels/rules");

const occasionValidation = {
  create: [
    new BodyWithLocale("slug").notEmpty(),
    new BodyWithLocale("name").notEmpty(),
  ],
};

module.exports = occasionValidation;
