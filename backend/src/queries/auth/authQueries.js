// region model imports
import User from "../../models/user/userModel.js";
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  try {
    // Find active user by email using aggregation pipeline
    // Mongoose model call, no ?.
    const users = await User.aggregate([
      {
        $match: {
          Email: (email || "").trim().toLowerCase(),
          Is_Deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
          User_Id: "$_id", // Alias
          Name: 1,
          Email: 1,
          Password: 1,
          Role: 1,
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
    ]);

    // Return first user or null if not found
    return users?.length > 0 ? users[0] : null;
  } catch (err) {
    console.error("Error finding user by email:", err);
    throw err;
  }
};
// endregion

// region exports
export { findUserByEmail };
// endregion
