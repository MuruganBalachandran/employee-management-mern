// region imports
// package imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

// validation imports
import { validateUpdateProfile } from "../../validations/index.js";

// query imports
import { updateUserProfile, deleteUserAccount } from "../../queries/index.js";
// endregion

// region get profile controller
const getProfile = async (req = {}, res = {}) => {
  try {
    const user = req?.user;
    
    // If user is an employee, fetch complete employee data
    if (user?.Role === "EMPLOYEE") {
      const Employee = (await import("../../models/employee/employeeModel.js")).default;
      const employeeData = await Employee.findOne({ 
        User_Id: user._id, 
        Is_Deleted: 0 
      }).lean();
      
      if (employeeData) {
        // Merge user data (Name, Email) with employee data
        const completeProfile = {
          _id: employeeData._id,
          Name: user.Name,
          Email: user.Email,
          Employee_Code: employeeData.Employee_Code,
          Age: employeeData.Age,
          Department: employeeData.Department,
          Phone: employeeData.Phone,
          Address: employeeData.Address,
          Salary: employeeData.Salary,
          Reporting_Manager: employeeData.Reporting_Manager,
          Joining_date: employeeData.Joining_date,
          Created_At: employeeData.Created_At,
          Updated_At: employeeData.Updated_At,
        };
        
        return sendResponse(
          res,
          STATUS_CODE?.OK || 200,
          RESPONSE_STATUS?.SUCCESS || "SUCCESS",
          "Profile fetched successfully",
          { user: completeProfile },
        );
      }
    }
    
    // For admins or if employee data not found, return user data only
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile fetched successfully",
      { user: req?.user },
    );
  } catch (err) {
    console.error("Error getting profile:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching profile",
    );
  }
};
// endregion

// region update profile controller
const updateProfile = async (req = {}, res = {}) => {
  try {
    // validate update input
    const validation = validateUpdateProfile(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode || STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    // Extract fields in camelCase from API payload with defaults
    const { name, password } = req.body || {};



    // Map to PascalCase for database update
    const updatedUser = await updateUserProfile(req?.user, {
      Name: name,
      Password: password,
    });

    if (!updatedUser) {
      return sendResponse(
        res,
        STATUS_CODE?.OK || 200,
        RESPONSE_STATUS?.SUCCESS || "SUCCESS",
        "No changes detected",
      );
    }

    // send success response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile updated successfully",
      updatedUser,
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error updating profile",
    );
  }
};
// endregion

// region delete user controller
const deleteAccount = async (req = {}, res = {}) => {
  try {
    const targetUser = req?.user;
    const deletedUser = await deleteUserAccount(targetUser);

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Account deleted successfully",
      deletedUser,
    );
  } catch (err) {
    console.error("Error deleting account:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || 500,
      "Error deleting account",
    );
  }
};
// endregion

// region exports
export { getProfile, updateProfile, deleteAccount };
// endregion
