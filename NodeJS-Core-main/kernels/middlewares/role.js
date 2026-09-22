const responseUtils = require("utils/responseUtils");

const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return responseUtils.unauthorized(res, "Access denied: User role undefined");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return responseUtils.unauthorized(res, "Forbidden: Insufficient privileges");
    }

    return next();
  };
};

module.exports = role;
