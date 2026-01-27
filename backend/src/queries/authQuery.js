// region imports
const User = require("../models/userModel");
// endregion

// region auth queries

//  Used during login 
const findUserByEmail = async (email = "") => {
  return await User.findOne({ email: email?.toLowerCase?.() ?? "" })
    .select("+password") 
    .exec();
};

//  Register user
const createUser = async ({ name = "", email = "", password = "" } = {}) => {
  const user = new User({ name, email, password });
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;   //  prevent leak
  return userObj;
};

//  Get user profile 
const findUserById = async (id = "") => {
  return await User.findById(id).lean(); // password already excluded
};

// endregion

// region exports
module.exports = { findUserByEmail, createUser, findUserById };
// endregion
