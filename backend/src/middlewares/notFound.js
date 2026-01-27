// region imports
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES } = require("../constants");
// endregion

// region exports
module.exports = (req, res) => {
  return apiResponse(
    res,
    STATUS_CODES.NOT_FOUND,
    false,
    "",
    null,
    `Route ${req.originalUrl} not found`
  );
};
// endregion
