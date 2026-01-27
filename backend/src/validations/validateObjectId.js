// region imports
const mongoose = require("mongoose");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
// endregion

// region middleware
const validateObjectId = (paramName = "id") => (req, res, next) => {
  const value = req?.params?.[paramName];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return apiResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      false,
      "",
      null,
      MESSAGES.INVALID_OBJECT_ID ?? "Invalid ID format"
    );
  }

  next();
};
// endregion

module.exports = validateObjectId;
