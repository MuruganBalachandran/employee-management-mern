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
// endregion

// region create employee
const addEmployee = asyncHandler(async (req, res) => {
  const {
    name = "",
    email = "",
    department = "",
    phone = "",
    address: { line1 = "", line2 = "", city = "", state = "", zip = "" } = {},
  } = req.body ?? {};

  const data = { name, email, department, phone, address: { line1, line2, city, state, zip } };
  const userId = req?.user?._id ?? "";

  try {
    const employee = await createEmployee({ ...data, createdBy: userId });
    return apiResponse(
      res,
      STATUS_CODES.CREATED,
      true,
      MESSAGES.EMPLOYEE_CREATED ?? "Employee created successfully",
      { employee },
    );
  } catch (err) {
    // Duplicate key error
    if (err.code === 11000 && err.keyValue?.email) {
      return apiResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        false,
        "Validation failed",
        null,
        { email: "Email already exists" } // structured error
      );
    }

    // Any other error
    return apiResponse(
      res,
      STATUS_CODES.SERVER_ERROR,
      false,
      err.message || "Failed to create employee",
    );
  }
});

// endregion
// region list employees
const listEmployees = asyncHandler(async (req, res) => {
  const userId = req?.user?._id ?? "";
  const skip = Number(req.query.skip) || 0;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const search = req.query.search || "";
  const department = req.query.department || "";

  const filter = { createdBy: userId, isDeleted: false };

  // Apply search filter
  if (search) {
    filter.name = { $regex: search, $options: "i" }; // case-insensitive
  }

  // Apply department filter
  if (department) {
    filter.department = department; // exact match
  }

  const { count, items } = await getAllEmployees(filter, skip, limit);

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEES_FETCHED ?? "Employees fetched successfully",
    { count, items }
  );
});
// endregion

// region get single employee
const getEmployee = asyncHandler(async (req, res) => {
  const id = req?.params?.id ?? "";
  const userId = req?.user?._id ?? "";
  const employee = await getEmployeeById(id, userId);
  if (!employee)
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      "",
      null,
      MESSAGES.NO_RECORDS ?? "No records found",
      
    );
  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_FETCHED ?? "Employee fetched successfully",
    { employee },
  );
});
// endregion

// region update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const id = req?.params?.id ?? "";
  
  const userId = req?.user?._id ?? "";
 const {
    name,
    department,
    phone,
    address: {
      line1,
      line2,
      city,
      state,
      zip,
    } = {},
  } = req?.body ?? {};

  const data = {
    ...(name !== undefined && { name }),
    ...(department !== undefined && { department }),
    ...(phone !== undefined && { phone }),
    ...(line1 || line2 || city || state || zip
      ? { address: { line1, line2, city, state, zip } }
      : {}),
  };

  const updated = await updateEmployeeById(id, userId, data);
  if (!updated)
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      MESSAGES.NO_RECORDS ?? "No records found",
      null,
    );

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_UPDATED ?? "Employee updated successfully",
    { employee: updated },
  );
});
// endregion

// region delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = req?.params?.id ?? "";
  const userId = req?.user?._id ?? "";

  const deleted = await deleteEmployeeById(id, userId);
  if (!deleted)
    return apiResponse(
      res,
      STATUS_CODES.SUCCESS,
      true,
      MESSAGES.NO_RECORDS ?? "No records found",
      null,
    );

  return apiResponse(
    res,
    STATUS_CODES.SUCCESS,
    true,
    MESSAGES.EMPLOYEE_DELETED ?? "Employee deleted successfully",
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
