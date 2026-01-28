// region imports
const Employee = require("../models/employeeModel");
// endregion

// region employee queries

// create employee
const createEmployee = async (data = {}) => {
  const employee = new Employee(data);
  await employee.save();
  return employee.toObject?.();
};

// get employee by id
const getEmployeeById = async (id = "") => {
  return await Employee.findOne({ _id: id, isDeleted: false }).lean();
};

const getAllEmployees = async (filter = {}, skip = 0, limit = 20) => {
  const query = { isDeleted: false, ...filter };
  const [count, items] = await Promise.all([
    Employee.countDocuments(query),
    Employee.find(query)
      .skip(Math.max(skip, 0))
      .limit(Math.min(limit, 100))
      .lean(),
  ]);
  return { count, items };
};


// region update employee by id
const updateEmployeeById = async (id = "", userId = "", data = {}) => {
  return await Employee.findOneAndUpdate(
    { _id: id, createdBy: userId, isDeleted: false }, // secure
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
};
// endregion


// delete employee by id
const deleteEmployeeById = async (id = "") => {
  return await Employee.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  ).lean();
};

// endregion

// region exports
module.exports = {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
};
// endregion
