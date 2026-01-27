// region imports
const authRouter = require("./authRouter");
const healthRouter = require("./healthRouter");
const employeeRouter = require("./employeeRouter");
// endregion

// region exports
const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/employees", employeeRouter);
module.exports = router;
// endregion
