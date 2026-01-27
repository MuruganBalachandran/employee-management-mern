// region imports
const express = require("express");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
// endregion

// region router
const router = express.Router();

// health check endpoint
router.get("/", (req, res) => {
  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.HEALTH_CHECK ?? "Server is running",
    { timestamp: new Date().toISOString() }
  );
});
// endregion

// region exports
module.exports = router;
// endregion
