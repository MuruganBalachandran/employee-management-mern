// region api response formatter
const apiResponse = (
  res,
  statusCode = 200,
  status = true,
  message = "",
  data = null,
  error = null,
) => {
  // log error to console if status is false
  if (!status) {
    console.error("API Error:", error ?? message ?? "An error occurred");
  }

  const responsePayload = {
    statusCode,
    status,
    message: status ? (message ?? "") : undefined, // show message only if success
    data: status ? (data ?? null) : undefined, // show data only if success
    error: !status ? error ?? message ?? "An error occurred" : undefined, // show error if failure
  };

  
  return res.status(statusCode).json(responsePayload);
};
// endregion

// region exports
module.exports = { apiResponse };
// endregion
