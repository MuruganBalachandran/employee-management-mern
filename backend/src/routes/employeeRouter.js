// region imports
const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const validateJson = require("../middlewares/validateJson");
const { validateEmployee,validateEmployeeUpdate } = require("../validations/employeeValidation");
const {
  addEmployee,
  listEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const validateObjectId = require("../validations/validateObjectId");
// endregion

// region router
const router = express.Router();

// all routes are protected
router.use(auth);

// create
router.post("/", validateJson(validateEmployee), addEmployee);

// list all
router.get("/", listEmployees);

// get one
router.get("/:id",validateObjectId("id"), getEmployee);

// update
router.put("/:id", validateJson(validateEmployeeUpdate),validateObjectId("id"), updateEmployee);

// delete
router.delete("/:id",validateObjectId("id"), deleteEmployee);
// endregion

// region exports
module.exports = router;
// endregion
