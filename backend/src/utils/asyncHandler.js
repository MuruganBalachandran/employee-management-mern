// region asyncHandler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// endregion

// region exports
module.exports = asyncHandler;
// endregion
