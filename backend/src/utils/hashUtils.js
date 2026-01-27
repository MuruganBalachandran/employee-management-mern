// region imports
const bcrypt = require("bcryptjs");
// endregion

// region hash password
const hashPassword = async (password = "") =>
  await bcrypt.hash(password, 10);
// endregion

// region compare password
const comparePassword = async (password = "", hashedPassword = "") =>
  await bcrypt.compare(password, hashedPassword);
// endregion

// region exports
module.exports = { hashPassword, comparePassword };
// endregion
