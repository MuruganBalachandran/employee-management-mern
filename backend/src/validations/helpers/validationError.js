// region imports
import { STATUS_CODE } from "../../utils/constants/constants.js";
// endregion
// region helper - common error response
/**
 * Constructs a standardized validation error result object.
 * @param {Array} errors - List of error messages.
 * @returns {Object} Object containing isValid status and errors.
 */
const validationError = (errors) => ({
  isValid: false,
  error: errors,
  statusCode: STATUS_CODE.BAD_REQUEST,
});
// endregion

export { validationError };