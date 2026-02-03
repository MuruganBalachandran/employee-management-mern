// region model imports
import mongoose from 'mongoose';
import User from '../../models/user/userModel.js';
import Admin from '../../models/admin/adminModel.js';
import Employee from '../../models/employee/employeeModel.js';
import { hashPassword, getFormattedDateTime, ROLE } from '../../utils/index.js';
// endregion

// region create user
/**
 * Persistence layer: Creates a new user in MongoDB.
 * Also creates corresponding Admin or Employee document.
 * @param {Object} userData - Contains Name, Email, Password, Age, Role.
 * @returns {Promise<Object>} The saved User document.
 */
const createUser = async (userData = {}) => {
  try {
    const {
      Name = '',
      Email = '',
      Password = '',
      Age = 0,
      Role = ROLE.EMPLOYEE,
      Department = '',
      Phone = '',
      Address = {},
    } = userData || {};

    // Create new user instance
    const user = new User({
      Name: (Name || "").trim(),
      Email: (Email || "").trim().toLowerCase(),
      Password: Password || "",                 // pre-save hook will hash
      Age: Age || 0,
      Role: Role || ROLE.EMPLOYEE,
      Department: (Department || "").trim(),
      Phone: (Phone || "").trim(),
      Address: Address || {},
    });

    // Save user in DB - Mongoose model call, no ?.
    await user.save();

    // Create corresponding Admin or Employee document
    if (Role === ROLE.ADMIN || Role === ROLE.SUPER_ADMIN) {
      const admin = new Admin({
        Admin_Id: user._id,
        Name: user.Name,
        Email: user.Email,
        Password: user.Password,
        Age: user.Age,
        Department: user.Department,
        Phone: user.Phone,
        Address: user.Address,
      });
      await admin.save();
    } else if (Role === ROLE.EMPLOYEE) {
      const employee = new Employee({
        User_Id: user._id,
        Name: user.Name,
        Email: user.Email,
        Password: user.Password,
        Age: user.Age,
        Department: user.Department,
        Phone: user.Phone,
        Address: user.Address,
      });
      await employee.save();
    }

    // Return created user
    return user;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
// endregion

// region find user by email
/**
 * Looks up an active user by their email address.
 * Includes the Password field for authentication checks using aggregate.
 */
const findUserByEmail = async (email = '') => {
  try {
    // Find active user by email using aggregation pipeline
    // Mongoose model call, no ?.
    const users = await User.aggregate([
      {
        $match: {
          Email: (email || "").trim().toLowerCase(),
          Is_Deleted: 0,
        }
      },
      {
        $project: {
          _id: 1,
          Name: 1,
          Email: 1,
          Password: 1,
          Age: 1,
          Role: 1,
          Department: 1,
          Phone: 1,
          Address: 1,
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        }
      }
    ]);

    // Return first user or null if not found
    return users?.length > 0 ? users[0] : null;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};
// endregion

// region exports
export {
  createUser,
  findUserByEmail,
};
// endregion
