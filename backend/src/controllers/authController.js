// region imports
const asyncHandler = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
const { findUserByEmail, createUser } = require("../queries/authQuery");
const { signToken } = require("../utils/jwtUtils");
// endregion

// region ADMIN register
const register = asyncHandler(async (req, res) => {
  const { name = "", email = "", password = "" } = req.body ?? {};

  // check existing
  const existing = await findUserByEmail(email);
  if (existing) {
    return apiResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      false,
      MESSAGES.EMAIL_EXISTS ?? "Email already exists",
    );
  }

  const user = await createUser({
    name,
    email,
    password,
    role: "admin", // only admin created here
  });

  return apiResponse(
    res,
    STATUS_CODES.CREATED,
    true,
    MESSAGES.USER_REGISTERED ?? "Admin registered",
    { user },
  );
});
// endregion

// region login (ADMIN & EMPLOYEE)
const login = asyncHandler(async (req, res) => {
  const { email = "", password = "" } = req.body ?? {};

  const user = await findUserByEmail(email.toLowerCase());
  if (!user) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.INVALID_CREDENTIALS ?? "Invalid credentials",
    );
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.INVALID_CREDENTIALS ?? "Invalid credentials",
    );
  }

  const token = signToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  delete user.password;

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.LOGIN_SUCCESS ?? "Login successful",
    { user, token },
  );
});
// endregion

// region logout
const logout = asyncHandler(async (req, res) => {
  const email = req?.user?.email;

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.LOGOUT_SUCCESS?.replace("{email}", email) ??
      `User ${email} logged out`,
  );
});
// endregion

// region current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.USER_FETCHED ?? "Current user",
    { user: req.user },
  );
});
// endregion

// region exports
module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
// endregion
