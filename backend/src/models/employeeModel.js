// region imports
const mongoose = require("mongoose");
// endregion

// region employee schema
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      default: "",
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
      ],
      required: true,
      default: "Others",
    },
    phone: {
      type: String,
      required: true,
      default: "",
    },
    address: {
      line1: {
        type: String,
        required: true,
        default: "",
      },
      line2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        required: true,
        default: "",
      },
      state: {
        type: String,
        required: true,
        default: "",
      },
      zip: {
        type: String,
        required: true,
        default: "",
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
// endregion

// region model export
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
// endregion
