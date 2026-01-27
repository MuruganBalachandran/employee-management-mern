// region imports
const {
  NAME_REGEX,
  PHONE_REGEX,
  ZIP_REGEX,
  EMAIL_REGEX,
} = require("../utils/commonUtil");
// endregion

// region validate employee for create
const validateEmployee = (data = {}) => {
  const errors = {};

  const name = data?.name?.trim?.() ?? "";
  const email = data?.email?.trim?.() ?? "";
  const department = data?.department?.trim?.() ?? "";
  const phone = data?.phone?.trim?.() ?? "";
  const line1 = data?.address?.line1?.trim?.() ?? "";
  const city = data?.address?.city?.trim?.() ?? "";
  const state = data?.address?.state?.trim?.() ?? "";
  const zip = data?.address?.zip?.trim?.() ?? "";

  // name
  if (!name) {
    errors.name = "Name is required";
  } else if (!NAME_REGEX.test(name)) {
    errors.name = "Name must be 2–50 letters only";
  }

  // email
  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Invalid email format";
  }

  // department
  if (!department) {
    errors.department = "Department is required";
  }

  // phone
  if (!phone) {
    errors.phone = "Phone is required";
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = "Phone must be a valid 10-digit number";
  }

  // address
  if (!line1) {
    errors.line1 = "Address line1 is required";
  }
  if (!city) {
    errors.city = "City is required";
  }
  if (!state) {
    errors.state = "State is required";
  }
  if (!zip) {
    errors.zip = "Zip code is required";
  } else if (!ZIP_REGEX.test(zip)) {
    errors.zip = "Zip code must be 5 or 6 digits";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
// endregion

const validateEmployeeUpdate = (data = {}) => {
  const errors = {};

  // Email cannot be updated
  if (data?.email !== undefined) {
    errors.email = "Email cannot be updated";
  }

  // Name validation
  if (data?.name !== undefined) {
    const name = data.name?.trim?.() ?? "";
    if (!name) {
      errors.name = "Name cannot be empty";
    } else if (!NAME_REGEX.test(name)) {
      errors.name = "Name must be 2–50 letters only";
    }
  }

  // Phone validation
  if (data?.phone !== undefined) {
    const phone = data.phone?.trim?.() ?? "";
    if (!phone) {
      errors.phone = "Phone cannot be empty";
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = "Phone must be a valid 10-digit number";
    }
  }

  // Department validation
  if (data?.department !== undefined) {
    const dept = data.department?.trim?.() ?? "";
    if (!dept) {
      errors.department = "Department cannot be empty";
    }
  }

  // Address validation
  if (data?.address !== undefined) {
    const line1 = data.address?.line1?.trim?.() ?? "";
    const city = data.address?.city?.trim?.() ?? "";
    const state = data.address?.state?.trim?.() ?? "";
    const zip = data.address?.zip?.trim?.() ?? "";

    if (line1 !== undefined) {
      const value = line1?.trim?.() ?? "";
      if (!value) {
        errors.line1 = "Address line1 cannot be empty";
      }
    }

    if (city !== undefined) {
      const value = city?.trim?.() ?? "";
      if (!value) {
        errors.city = "City cannot be empty";
      }
    }

    if (state !== undefined) {
      const value = state?.trim?.() ?? "";
      if (!value) {
        errors.state = "State cannot be empty";
      }
    }

    if (zip !== undefined) {
      const value = zip?.trim?.() ?? "";
      if (!value) {
        errors.zip = "Zip code cannot be empty";
      } else if (!ZIP_REGEX.test(value)) {
        errors.zip = "Zip code must be 5 or 6 digits";
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
// endregion

// region exports
module.exports = { validateEmployee, validateEmployeeUpdate };
