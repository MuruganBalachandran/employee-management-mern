// region imports
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
// endregion

// region user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      // required: true,
      default: "admin",
    },
  },
  { timestamps: true },
);
// endregion

// region password hash middleware (CREATE & SAVE)
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await hashPassword(this.password);
    }
  } catch (err) {
    next(err);
  }
});
// endregion

// region hash password on UPDATE too
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (update?.password) {
      update.password = await hashPassword(update?.password);
      this.setUpdate(update);
    }

    next();
  } catch (err) {
    next(err);
  }
});
// endregion

// region password compare method
userSchema.methods.comparePassword = async function (enteredPassword = "") {
  return await comparePassword(enteredPassword, this.password);
};
// endregion

// region model export
const User = mongoose.model("User", userSchema);
module.exports = User;
// endregion
