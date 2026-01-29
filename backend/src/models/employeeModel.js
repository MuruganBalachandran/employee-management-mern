// region imports
const mongoose = require("mongoose");
// endregion

// region schema
const employeeSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one employee per user
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
        email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    department: {
      type: String,
      enum: [
        "HR",
        "Sales",
        "Marketing",
        "Tester",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Machine Learning",
        "Deep Learning",
        "Network",
        "Cyber Security",
        "DevOps",
        "Others",
      ],
      required: true,
      default: "Others",
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
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
employeeSchema.index({ isDeleted: 1 });
// endregion

// region export
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
// endregion
