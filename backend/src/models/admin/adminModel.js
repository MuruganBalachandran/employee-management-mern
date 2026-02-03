// region imports
import mongoose from "mongoose";
import validator from "validator";
import { hashPassword, verifyPassword, getFormattedDateTime } from "../../utils/common/commonFunctions.js";
// endregion


// region schema
const AdminSchema = new mongoose.Schema(
    {
        Admin_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        Name: {
            type: String,
            required: true,
            trim: true,
        },

        Email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        Password: {
            type: String,
            required: true,
        },

        Age: {
            type: Number,
            default: 0,
        },

        Department: {
            type: String,
            required: true,
            trim: true,
        },

        Phone: {
            type: String,
            required: true,
            trim: true,
        },

        Address: {
            Line1: { type: String, required: true },
            Line2: { type: String },
            City: { type: String, required: true },
            State: { type: String, required: true },
            ZipCode: { type: String, required: true },
        },

        Is_Deleted: {
            type: Number,
            default: 0,
        },

        // manual timestamps
        Created_At: {
            type: String,
            default: () => getFormattedDateTime() || new Date().toISOString(),
        },

        Updated_At: {
            type: String,
            default: () => getFormattedDateTime() || new Date().toISOString(),
        },
    },
    {
        versionKey: false,
        timestamps: false,
    }
);
// endregion


// region minimal indexes
// Email unique only for ACTIVE admins
AdminSchema?.index?.(
    { Email: 1 },
    { unique: true, partialFilterExpression: { Is_Deleted: 0 } }
);

// admin filtering and sorting
AdminSchema?.index?.({ Admin_Id: 1 });
AdminSchema?.index?.({ Is_Deleted: 1 });
AdminSchema?.index?.({ Created_At: -1 }); // Optimize recent admin sorting
AdminSchema?.index?.({ Name: 1 });       // Optimize admin searching

// endregion


// region middleware

/**
 * Pre-save hook to hash password and update the Updated_At timestamp.
 */
AdminSchema?.pre?.("save", async function () {
    if (this?.isModified?.("Password")) {
        // Standardize: Only hash if it's not already hashed (prevents double-hashing)
        if (!this.Password?.startsWith?.("$argon2")) {
            this.Password = await hashPassword?.(this?.Password);
        }
    }
    this.Updated_At = getFormattedDateTime?.() ?? new Date()?.toISOString?.();
});

/**
 * Pre-update hook to hash password (if provided) and update the Updated_At timestamp.
 */
AdminSchema?.pre?.("findOneAndUpdate", async function () {
    const update = this?.getUpdate?.();
    if (!update) return;

    const pwd = update?.Password || update?.$set?.Password;

    if (pwd && !pwd?.startsWith?.("$argon2")) {
        const hashed = await hashPassword?.(pwd);
        if (update?.Password) update.Password = hashed;
        if (update?.$set?.Password) update.$set.Password = hashed;
    }

    if (!update?.$set) update.$set = {};
    update.$set.Updated_At = getFormattedDateTime?.() ?? new Date()?.toISOString?.();
});

// endregion


// region methods
/**
 * Instance method to compare a plain password with the stored hash.
 */
AdminSchema.methods.comparePassword = async function (password = "") {
    return verifyPassword?.(password, this?.Password) ?? false;
};
// endregion


// region transforms
const transform = (doc, ret) => {
    if (ret) {
        delete ret.Password;
        delete ret.Is_Deleted;
    }
    return ret;
};

AdminSchema?.set?.("toJSON", { transform });
AdminSchema?.set?.("toObject", { transform });
// endregion


// region model
const Admin = mongoose?.model?.("Admin", AdminSchema);
// endregion


// region exports
export default Admin;
// endregion
