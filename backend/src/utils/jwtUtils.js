// region imports
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
// endregion

// region sign token
const signToken = (payload = {}) => {
  return jwt.sign(payload ?? {}, JWT_SECRET ?? "defaultsecret", {
    expiresIn: "1h",
  });
};
// endregion

// region verify token
const verifyToken = (token = "") => {
  return jwt.verify(token ?? "", JWT_SECRET ?? "defaultsecret");
};
// endregion

// region exports
module.exports = { signToken, verifyToken };
// endregion
