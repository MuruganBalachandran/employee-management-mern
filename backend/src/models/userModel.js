// region imports
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
// endregion

// region schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
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
      default: "employee",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);
// endregion

// region indexes
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);
// endregion

// region password hash on save
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

// region password hash on update
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (update?.$set?.password) {
      update.$set.password = await hashPassword(update.$set.password);
    }
  } catch (err) {
    next(err);
  }
});
// endregion

// region compare password
userSchema.methods.comparePassword = function (enteredPassword = "") {
  return comparePassword(enteredPassword, this.password);
};
// endregion

// region export
const User = mongoose.model("User", userSchema);
module.exports = User;
// endregion
