// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region update user profile
const updateUserProfile = async (user = {}, updateData = {}) => {
  try {
    const allowedFields = ["Name", "Password"];
    const updateSet = {
        Updated_At: getFormattedDateTime()
    };
    
    let isChanged = false;
    
    for (const field of allowedFields) {
        if (updateData[field] !== undefined && updateData[field] !== user[field]) { // user might be object here, careful
            // Wait, 'user' argument is likely the User Document from req.user (from auth middleware).
            // So we HAVE the document.
            // If we have same values, we can skip DB call entirely! (Zero DB hits).
            // But if we do have changes...
             updateSet[field] = field === "Name" ? updateData[field].trim() || "" : updateData[field];
             isChanged = true;
        }
    }
    
    if (!isChanged) return null; // 0 hits
    
    // 1 DB Hit
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, Is_Deleted: 0 },
        { $set: updateSet },
        { new: true }
    );
    
    return updatedUser;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err;
  }
};
// endregion

// region delete user account
const deleteUserAccount = async (target = {}) => {
  try {
    if (!target) return null;

    let userId = target;
    // If target is object (user doc), take _id
    if (typeof target === "object" && target._id) {
        userId = target._id;
    }

    // Check strict super admin restriction? 
    // If we skip find, we can't check Role first. 
    // But we can include Role in query filter to PREVENT finding it if it is Super Admin!
    // { _id: userId, Role: { $ne: ROLE.SUPER_ADMIN } }
    
    const user = await User.findOneAndUpdate(
        { _id: userId, Role: { $ne: ROLE.SUPER_ADMIN }, Is_Deleted: 0 },
        { 
            $set: { 
                Is_Deleted: 1, 
                Updated_At: getFormattedDateTime() 
            } 
        },
        { new: true }
    );
    
    // If null, either not found, already deleted, or was SUPER_ADMIN.
    // If it was super admin, we silently fail (or return null). This is acceptable.
    
    return user;
  } catch (err) {
    console.error("Error deleting user account:", err);
    throw err;
  }
};
// endregion

// region admin management
const findSuperAdmin = async () => {
  try {
    const admins = await User.aggregate([
      {
        $match: {
          Role: ROLE.SUPER_ADMIN,
          Is_Deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
          User_Id: "$_id", // Alias
          Name: 1,
          Email: 1,
          Role: 1,
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
      { $limit: 1 },
    ]);

    return admins.length > 0 ? admins[0] : null;
  } catch (err) {
    console.error("Error finding super admin:", err);
    throw err;
  }
};

// Fetches an active user by their primary ID using aggregate
const findUserById = async (id = "") => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          Is_Deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
          User_Id: "$_id", // Alias
          Name: 1,
          Email: 1,
          Role: 1, // Password usually not returned by ID unless needed? Let's exclude it for safety or keep if needed.
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
      { $limit: 1 },
    ]);

    return users.length > 0 ? users[0] : null;
  } catch (err) {
    console.error("Error finding user by ID:", err);
    throw err;
  }
};

// Creation hook specifically for the initial Super Admin account
const createInitialSuperAdmin = async (email = "", password = "") => {
  try {
    const superAdmin = new User({
      Name: "Super Admin",
      Email: email.trim().toLowerCase() || "",
      Password: password,
      Role: ROLE.SUPER_ADMIN,
    });
    await superAdmin.save();
    return superAdmin;
  } catch (err) {
    console.error("Error creating initial super admin:", err);
    throw err;
  }
};
// endregion

// region exports
export {
  updateUserProfile,
  deleteUserAccount,
  findSuperAdmin,
  findUserById,
  createInitialSuperAdmin,
};
// endregion
