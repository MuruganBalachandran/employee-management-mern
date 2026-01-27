// region request logger
const requestLogger = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
};
// endregion

// region exports
module.exports = requestLogger;
// endregion