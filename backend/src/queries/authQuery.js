// region imports
const User = require("../models/userModel");
// endregion

// region find by email (login)
const findUserByEmail = async (email = "") => {
  return await User.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  })
    .select("+password")
};
// endregion

// region create user
const createUser = async ({
  name = "",
  email = "",
  password = "",
  role = "employee",
} = {}) => {
  const existing = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (existing) {
    const err = new Error("Email already exists");
    err.code = 11000;
    throw err;
  }

  const user = new User({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
  });

  await user.save();

  const obj = user.toObject();
  delete obj.password;
  return obj;
};
// endregion

// region find user by id
const findUserById = async (id = "") => {
  return await User.findOne({ _id: id, isDeleted: false }).lean();
};
// endregion

// region exports
module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};
// endregion
