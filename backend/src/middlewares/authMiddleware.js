// region imports
const { verifyToken } = require("../utils/jwtUtils");
const asyncHandler = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
const { findUserById } = require("../queries/authQuery");
// endregion

// region main auth middleware
const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req?.headers?.authorization ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.NOT_AUTHORIZED ?? "Not authorized"
    );
  }

  const decoded = verifyToken(token);
  if (!decoded?.id) {
    return apiResponse(res, STATUS_CODES.UNAUTHORIZED, false, "Invalid token");
  }

  const user = await findUserById(decoded.id);
  if (!user || user.isDeleted) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.NOT_AUTHORIZED ?? "Not authorized"
    );
  }

  req.user = user;
  next();
});
// endregion

// region ADMIN guard
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return apiResponse(res, STATUS_CODES.FORBIDDEN, false, "Admin access required");
  }
  next();
});
// endregion

// region EMPLOYEE guard (optional)
const employeeOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "employee") {
    return apiResponse(res, STATUS_CODES.FORBIDDEN, false, "Employee access required");
  }
  next();
});
// endregion

// region exports
module.exports = { auth, adminOnly, employeeOnly };
// endregion
