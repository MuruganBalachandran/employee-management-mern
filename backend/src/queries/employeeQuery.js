// region imports
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
// endregion

// region create employee
const createEmployee = async (data = {}) => {
  const employee = new Employee(data);
  await employee.save();
  return employee.toObject();
};
// endregion

// region get by id
const getEmployeeById = async (id = "") => {
  return await Employee.findOne({ _id: id, isDeleted: false })
    .populate("userRef", "email role")
    .lean();
};
// endregion

// region list all employees (ADMIN)
const getAllEmployees = async (filter = {}, skip = 0, limit = 20) => {
  const query = { ...filter, isDeleted: false };

  const [count, items] = await Promise.all([
    Employee.countDocuments(query),
    Employee.find(query)
      .populate("userRef", "email role")
      .skip(skip)
      .limit(Math.min(limit, 100))
      .lean(),
  ]);

  return { count, items };
};
// endregion

// region update employee
const updateEmployeeById = async (id = "", data = {}) => {
  return await Employee.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate("userRef", "email role")
    .lean();
};
// endregion

// region delete employee (soft + cascade)
const deleteEmployeeById = async (id = "") => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!employee) return null;

  await User.findOneAndUpdate(
    { _id: employee.userRef, isDeleted: false },
    { isDeleted: true }
  );

  return employee.toObject();
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
