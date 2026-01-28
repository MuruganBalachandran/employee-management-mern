// region imports
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES } = require("../constants");
// endregion

// region global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err); // log for debugging
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0];
    return apiResponse(
      res,
      err?.statusCode ?? STATUS_CODES.BAD_REQUEST,
      false,
      null,
      null,
      `${field} already exists`,
    );
  }
  // return error response
  return apiResponse(
    res,
    err?.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR,
    false,
    null,
    null,
    err?.message ?? "Internal Server Error",
  );
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
