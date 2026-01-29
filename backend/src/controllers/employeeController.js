// region imports
const asyncHandler = require("../utils/asyncHandler");
const { apiResponse } = require("../utils/apiResponse");
const { STATUS_CODES, MESSAGES } = require("../constants");
const {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
} = require("../queries/employeeQuery");
const { createUser } = require("../queries/authQuery");
const User = require("../models/userModel");
// endregion

// region add employee (ADMIN ONLY)
const addEmployee = asyncHandler(async (req, res) => {
  const {
    name = "",
    email = "",
    password = "",
    department = "",
    phone = "",
    address: { line1 = "", line2 = "", city = "", state = "", zip = "" } = {},
  } = req.body ?? {};

  let user; // for rollback

  try {
    // create login
    user = await createUser({
      name,
      email,
      password,
      role: "employee",
    });

    // create employee profile
    const employee = await createEmployee({
      userRef: user._id,
      name,
      email,
      department,
      phone,
      address: { line1, line2, city, state, zip },
    });

    return apiResponse(res, STATUS_CODES.CREATED, true, "Employee created", {
      employee,
    });
  } catch (err) {
    // rollback user if employee failed
    if (user?._id) {
      await User.findOneAndUpdate({ _id: user._id }, { isDeleted: true });
    }

    return apiResponse(res, 500, false, err.message);
  }
});
// endregion

// region list all employees
const listEmployees = asyncHandler(async (req, res) => {
  const skip = Number(req.query.skip) || 0;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const search = req.query.search || "";
  const department = req.query.department || "";

  const filter = {};

  if (search) filter.name = { $regex: search, $options: "i" };
  if (department) filter.department = department;

  const { count, items } = await getAllEmployees(filter, skip, limit);

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEES_FETCHED ?? "Employees fetched",
    { count, items },
  );
});
// endregion

// region get one employee
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await getEmployeeById(req.params.id);

  if (!employee) {
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      MESSAGES.NO_RECORDS ?? "No record found",
      null,
    );
  }

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_FETCHED ?? "Employee fetched",
    { employee },
  );
});
// endregion

// region update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const { name, department, phone, address = {} } = req.body ?? {};

  const data = {
    ...(name !== undefined && { name }),
    ...(department !== undefined && { department }),
    ...(phone !== undefined && { phone }),
    ...(Object.keys(address).length && { address }),
  };

  const updated = await updateEmployeeById(req.params.id, data);

  if (!updated) {
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      MESSAGES.NO_RECORDS ?? "No record found",
      null,
    );
  }

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_UPDATED ?? "Employee updated",
    { employee: updated },
  );
});
// endregion

// region delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const deleted = await deleteEmployeeById(req.params.id);

  if (!deleted) {
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      MESSAGES.NO_RECORDS ?? "No record found",
      null,
    );
  }

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_DELETED ?? "Employee deleted",
    { employee: deleted },
  );
});
// endregion

// region exports
module.exports = {
  addEmployee,
  listEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
// endregion
