// region imports
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
// endregion

// region validate JSON middleware factory
const validateJson = (validationFn = (data = {}) => ({ valid: true, errors: {} })) => {
  return (req, res, next) => {
    try {
      const body = req?.body ?? {};
      const { valid, errors } = validationFn(body ?? {});

      if (!valid) {
        return apiResponse(
          res,
          STATUS_CODES.BAD_REQUEST,
          false,
          MESSAGES.VALIDATION_FAILED ?? "Validation failed",
          null,
          errors 
        );
      }

      next(); 
    } catch (err) {
      next(err); //  for unhandled exceptions
    }
  };
};
// endregion

// region exports
module.exports = validateJson;
// endregion
