// region imports
const { verifyToken } = require("../utils/jwtUtils");

const asyncHandler = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
const { findUserById } = require("../queries/authQuery");
// endregion

// region auth middleware
const auth = asyncHandler(async (req, res, next) => {
  // headers
  const authHeader = req?.headers?.authorization ?? "";
  // extract token from headers
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

    // if not token, send error
  if (!token) {
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.NOT_AUTHORIZED ?? "Not authorized",
    );
  }

  // verify token
   const decoded = verifyToken(token);
  if (!decoded?.id) throw new Error("Token invalid");

  // fetch user from query
  const user = await findUserById(decoded.id);
  if (!user)
    return apiResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      false,
      MESSAGES.NOT_AUTHORIZED ?? "Not authorized",
    );

  req.user = user; 
  next();
});
// endregion

// region exports
module.exports = { auth };
// endregion
