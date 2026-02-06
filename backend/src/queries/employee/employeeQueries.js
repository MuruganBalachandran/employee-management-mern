// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (userData = {}, adminId = null) => {
  try {
    const {
      Name = "",
      Email = "",
      Password = "",
        Employee_Code = "", 
      Age = 0,
      Department = "",
      Phone = "",
      Address = {},
      Salary = 0,
      Reporting_Manager = null,
      Joining_date = null,
    } = userData || {};

    // Create User document
    const user = new User({
        Name: Name.trim() || "",
        Email: Email.trim().toLowerCase() || "",
        Password: Password,
        Role: ROLE.EMPLOYEE,
    });
    await user.save();
    
    // Create Employee document
    const employee = new Employee({
      User_Id: user._id,
      Admin_Id: adminId, 
      Employee_Code:Employee_Code || "",
      Age: Age || 0,
      Department: Department.trim() || "",
      Phone: Phone.trim() || "",
      Address: Address || {},
      Salary: Salary || 0,
      Reporting_Manager: Reporting_Manager, 
      Joining_date: Joining_date || new Date(),
      Is_Active: 1
    });

    await employee.save();
    return employee;
  } catch (err) {
    console.error("Error creating employee:", err);
    throw err;
  }
};
// endregion

// region get all employees
const getAllEmployees = async (
  limit = 20,
  skip = 0,
  search = "",
  department = "",
) => {
  try {
    const matchStage = { Is_Deleted: 0 };

    if (search) {
      matchStage.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      matchStage.Department = department;
    }

    const result = await Employee.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users", 
          localField: "User_Id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.Role": ROLE.EMPLOYEE } },
      {
          $lookup: {
              from: "employees",
              localField: "Reporting_Manager",
              foreignField: "_id",
              as: "manager"
          }
      },
      { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } }, 
      {
        $facet: {
          employees: [
            { $sort: { Created_At: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1, 
                Employee_Id: "$_id", // Alias
                User_Id: 1,
                Admin_Id: 1,
                Name: "$user.Name", // From User
                Email: "$user.Email", // From User
                Employee_Code: 1,
                Age: 1,
                Department: 1,
                Phone: 1,
                Address: 1,
                Salary: 1,
                Joining_date: 1,
                Is_Active: 1,
                Reporting_Manager: 1,
                Created_At: 1,
                Updated_At: 1,
                ManagerName: "$manager.Name"
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const employees = result[0]?.employees || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;

    return { employees, total };
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};
// endregion

// region get employee by id
const getEmployeeById = async (id = "") => {
  try {
    const employees = await Employee.aggregate([
      {
        $match: {
            _id: new mongoose.Types.ObjectId(id),
          Is_Deleted: 0,
        },
      },
      {
          $lookup: {
              from: "employees",
              localField: "Reporting_Manager",
              foreignField: "_id",
              as: "manager"
          }
      },
      { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users", 
          localField: "User_Id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          Employee_Id: "$_id", // Alias
          User_Id: 1,
          Admin_Id: 1,
          Name: "$user.Name", // From User
          Email: "$user.Email", // From User
          Employee_Code: 1,
          Age: 1,
          Department: 1,
          Phone: 1,
          Address: 1,
          Salary: 1,
          Joining_date: 1,
          Is_Active: 1,
          Reporting_Manager: 1,
          ManagerName: "$manager.Name",
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
    ]);

    return employees.length > 0 ? employees[0] : null;
  } catch (err) {
    console.error("Error finding employee by ID:", err);
    throw err;
  }
};
// endregion

// region update employee
// region update employee
const updateEmployee = async (filter = {}, updateData = {}) => {
  try {
    const { Name, ...employeeData } = updateData;
    
    // Admin can update these employee fields
    const employeeAllowedFields = [
        "Age", "Department", "Phone", "Address", "Personal_Email",
        "Salary", "Reporting_Manager", "Joining_date", "Employee_Code"
    ];

    const employeeUpdateSet = {
        Updated_At: getFormattedDateTime()
    };
    
    let hasEmployeeUpdates = false;

    Object.keys(employeeData).forEach(key => {
        if (employeeAllowedFields.includes(key)) {
             employeeUpdateSet[key] = employeeData[key];
             hasEmployeeUpdates = true;
        }
         if (key === 'Address' && typeof employeeData[key] === 'object') {
             employeeUpdateSet.Address = employeeData[key];
             hasEmployeeUpdates = true;
         }
    });

    const query = { ...filter, Is_Deleted: 0 };
    let doc = await Employee.findOne(query);
    
    if (!doc) return null;

    if (hasEmployeeUpdates) {
        doc = await Employee.findOneAndUpdate(
            query,
            { $set: employeeUpdateSet },
            { new: true } 
        );
    }
    
    // Update User Name if provided
    if (Name && doc.User_Id) {
         await User.findByIdAndUpdate(doc.User_Id, {
            Name: Name.trim(),
            Updated_At: getFormattedDateTime()
        });
    }

    return doc;
  } catch (err) {
    console.error("Error updating employee:", err);
    throw err;
  }
};
// endregion

// region delete employee
const deleteEmployee = async (employeeId = "") => {
  try {
    if (!employeeId) return null;

    const updateSet = {
        Is_Deleted: 1,
        Updated_At: getFormattedDateTime()
    }

    const doc = await Employee.findOneAndUpdate(
        { _id: employeeId },
        { $set: updateSet },
        { new: true }
    );
    
    if (!doc) return null;

    if (doc.User_Id) {
        await User.findByIdAndUpdate(doc.User_Id, {
            Is_Deleted: 1,
            Updated_At: getFormattedDateTime()
        });
    }

    return doc;
  } catch (err) {
    console.error("Error deleting employee:", err);
    throw err;
  }
};
// endregion

// region check employee code uniqueness
const isEmployeeCodeTaken = async (code, excludeId = null) => {
  const query = { Employee_Code: code };

  // while editing, ignore same employee
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Employee.findOne(query).lean();
  return !!existing;
};
// endregion

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeTaken,
};
