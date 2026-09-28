const authenticated = require("./authenticated");
const { optionalAuthenticated } = require("./authenticated");
const role = require("./role");

const middlewares = (middlewareArray) => {
  return [
    ...middlewareArray
  ];
};

module.exports = middlewares;
module.exports.authenticated = authenticated;
module.exports.optionalAuthenticated = optionalAuthenticated;
module.exports.role = role;