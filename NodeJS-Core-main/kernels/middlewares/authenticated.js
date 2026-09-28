const jwtUtils = require("utils/jwtUtils");
const responseUtils = require("utils/responseUtils");

const authenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return responseUtils.unauthorized(res, "Access token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwtUtils.verify(token);

  if (!decoded) {
    return responseUtils.unauthorized(res, "Token expired or invalid");
  }

  req.user = decoded;
  return next();
};

const optionalAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = jwtUtils.verify(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  return next();
};

module.exports = authenticated;
module.exports.authenticated = authenticated;
module.exports.optionalAuthenticated = optionalAuthenticated;

