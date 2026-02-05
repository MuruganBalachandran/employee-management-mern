// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Admin from "../../models/admin/adminModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (adminData = {}) => {
  try {
    const {
      Name = "",
      Email = "",
      Password = "",
    } = adminData || {};

    const user = new User({
        Name: Name.trim() || "",
        Email: Email.trim().toLowerCase() || "",
        Password: Password,
        Role: ROLE.ADMIN,
    });
    await user.save();
    
    const admin = new Admin({
      User_Id: user._id,
    });

    await admin.save();
    return admin;
  } catch (err) {
    console.error("Error creating admin:", err);
    throw err;
  }
};
// endregion

// region get all admins
const getAllAdmins = async (
  limit = 20,
  skip = 0,
  search = ""
) => {
  try {
    const matchStage = { Is_Deleted: 0 };

    if (search) {
        matchStage.$or = [
            { Name: { $regex: search, $options: "i" } },
            { Email: { $regex: search, $options: "i" } },
        ];
    }

    const result = await Admin.aggregate([
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
      { $match: { "user.Role": ROLE.ADMIN } },
      {
        $facet: {
          admins: [
            { $sort: { Created_At: -1 } },
            { $skip: skip },
            { $limit: limit },
             {
              $project: {
                _id: 1,
                Admin_Id: "$_id", // Explicit Alias
                User_Id: 1,
                Name: "$user.Name", // From User
                Email: "$user.Email", // From User
                Created_At: 1,
                Updated_At: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const admins = result[0]?.admins || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;

    return { admins, total };
  } catch (err) {
    console.error("Error fetching admins:", err);
    throw err;
  }
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  try {
    const admins = await Admin.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          Is_Deleted: 0,
        },
      },
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
          Admin_Id: "$_id",
          User_Id: 1,
          Name: "$user.Name", // From User
          Email: "$user.Email", // From User
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
    ]);

    return admins.length > 0 ? admins[0] : null;
  } catch (err) {
    console.error("Error finding admin by ID:", err);
    throw err;
  }
};
// endregion

// region update admin
// Minimal update: Name only as requested.
const updateAdmin = async (adminId = "", updateData = {}) => {
  try {
    // Admin update logic - Name only
    // If Name changed, we update User.
    // Admin collection doesn't hold Name anymore.
    // So we need to find the Admin to get User_Id.
    
    if (updateData.Name) {
        const adminDoc = await Admin.findOne({ _id: adminId, Is_Deleted: 0 });
        if (!adminDoc) return null;
        
        await User.findByIdAndUpdate(adminDoc.User_Id, {
            Name: updateData.Name,
            Updated_At: getFormattedDateTime()
        });
        
        // Return updated doc structure? 
        // We return the old admin doc but maybe controller needs new name.
        // Let's assume controller refetches if needed or we manually patch.
        return adminDoc; 
    }
    
    // If no name change, nothing to update in this simple model (unless unwanted fields passed).
    // Just return existing.
    return Admin.findOne({ _id: adminId, Is_Deleted: 0 });
  } catch (err) {
    console.error("Error updating admin:", err);
    throw err;
  }
};
// endregion

// region delete admin
const deleteAdmin = async (adminId = "") => {
  try {
    if (!adminId) return null;
    
    const updateSet = {
        Is_Deleted: 1,
        Updated_At: getFormattedDateTime()
    };
    
    const doc = await Admin.findOneAndUpdate(
        { _id: adminId },
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
    console.error("Error deleting admin:", err);
    throw err;
  }
};
// endregion

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
