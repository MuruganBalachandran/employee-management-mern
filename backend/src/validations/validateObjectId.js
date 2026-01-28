// region imports
const mongoose = require("mongoose");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
// endregion

// region middleware
const validateObjectId = (paramName = "id") => (req, res, next) => {
  const value = req?.params?.[paramName];

  // region check
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
  // endregion

  next();
};
// endregion

// region exports
module.exports = validateObjectId;
// endregion
