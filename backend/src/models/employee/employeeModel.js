// region imports
import mongoose from "mongoose";
import { getFormattedDateTime } from "../../utils/common/commonFunctions.js";
// endregion


// region schema
const EmployeeSchema = new mongoose.Schema(
    {
        Employee_Id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        // refer to User model
        User_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            auto: true,
        },
        // who created
        Admin_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            auto: true,
        },

        // Employee unique code/ID
        Employee_Code: {
            type: String,
            unique: true,
            sparse: true,
        },


        Age: {
            type: Number,
            default: 0,
        },

        Department: {
            type: String,
        },

        Phone: {
            type: String, 
        },
    
        Personal_Email:{

        },
        Salary:{
            type: Number,
            default: 0,
        },
        Reporting_Manager:{
            type: String,
        },

        Joining_date:{
            type: Date,
            default: Date.now,
        },

        Is_Active:{
            type: Number,
            default: 1,
        },

        Address: {
            Line1: { type: String },
            Line2: { type: String },
            City: { type: String },
            State: { type: String },
            ZipCode: { type: String },
        },

        Is_Deleted: {
            type: Number,
            default: 0,
        },

        // manual timestamps
        Created_At: {
            type: String,
            default: () => getFormattedDateTime(),
        },

        Updated_At: {
            type: String,
            default: () => getFormattedDateTime(),
        },
    },
    {
        versionKey: false,
        timestamps: false,
    }
);
// endregion


// region minimal indexes
// employee filtering and sorting
EmployeeSchema?.index({ User_Id: 1 });
EmployeeSchema?.index({ Is_Deleted: 1 });
EmployeeSchema?.index({ Created_At: -1 }); // Optimize recent employee sorting

// endregion


// region middleware
EmployeeSchema?.pre("save", function (next) {
    this.Updated_At = getFormattedDateTime();
  
});

EmployeeSchema?.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update) {
         if (!update.$set) update.$set = {};
         update.$set.Updated_At = getFormattedDateTime();
    }
});
// endregion
// endregion


// endregion


// region transforms
const transform = (doc, ret) => {
    if (ret) {
        delete ret.Password;
        delete ret.Is_Deleted;
    }
    return ret;
};

EmployeeSchema?.set("toJSON", { transform });
EmployeeSchema?.set("toObject", { transform });
// endregion


// region model
const Employee = mongoose?.model("Employee", EmployeeSchema);
// endregion


// region exports
export default Employee;
// endregion
