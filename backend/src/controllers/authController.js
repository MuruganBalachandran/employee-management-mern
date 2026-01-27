// region imports
const asyncHandler = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
const { findUserByEmail, createUser } = require("../queries/authQuery");
const { signToken } = require("../utils/jwtUtils");
// endregion

// region register controller
const register = asyncHandler(async (req, res) => {
  const { name = "", email = "", password = "" } = req?.body ?? {};

  const existingUser = await findUserByEmail(email?.toLowerCase?.());
  if (existingUser) {
    return apiResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      false,
      "",
      null,
      MESSAGES.EMAIL_EXISTS ?? "Email already registered"
    );
  }

  const user = await createUser({ name, email: email?.toLowerCase?.(), password });

  return apiResponse(
    res,
    STATUS_CODES.CREATED,
    true,
    MESSAGES.USER_REGISTERED ?? "User registered successfully",
    { user }
  );
});
// endregion

// region login controller
const login = asyncHandler(async (req, res) => {
  const { email = "", password = "" } = req?.body ?? {};

  const user = await findUserByEmail(email?.toLowerCase?.());
  if (!user) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.INVALID_CREDENTIALS ?? "Invalid credentials"
    );
  }

  const match = await user.comparePassword(password ?? "");
  if (!match) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.INVALID_CREDENTIALS ?? "Invalid credentials"
    );
  }

  const token = signToken({ id: user?._id ?? "", email: user?.email ?? "" });

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.LOGIN_SUCCESS ?? "Login successful",
    { user, token }
  );
});
// endregion

// region logout controller
const logout = asyncHandler(async (req, res) => {
  const user = req?.user ?? {};

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.LOGOUT_SUCCESS?.replace("{email}", user?.email ?? "") ??
      `User ${user?.email ?? ""} logged out successfully`
  );
});
// endregion

// region get current user controller
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req?.user ?? {};

  if (!user?._id) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.UNAUTHORIZED ?? "Not authorized"
    );
  }

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.USER_FETCHED ?? "Current user fetched",
    { user }
  );
});
// endregion

// region exports
module.exports = { register, login, logout, getCurrentUser };
// endregion
