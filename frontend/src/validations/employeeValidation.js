// region regex constants

export const NAME_REGEX = /^[A-Za-z ]{3,50}$/; // letters and spaces only
export const CITY_STATE_REGEX = /^[A-Za-z ]{2,50}$/; // letters and spaces only
export const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile
export const ZIP_REGEX = /^\d{5,6}$/; // 5 or 6 digits
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //  email format
export const VALID_DEPARTMENTS = [
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
  "DevOps"
];
// endregion

// region name validation
export const nameValidation = (name = "") => {
  if (typeof name !== "string") return "Name must be a string";

  const trimmed = name.trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length < 3) return "Name must be at least 3 characters";
  if (trimmed.length > 50) return "Name cannot exceed 50 characters";
  if (!NAME_REGEX.test(trimmed)) return "Name can only contain letters and spaces";
  return "";
};
// endregion

// region email validation
export const emailValidation = (email = "", type = "employee") => {
  if (typeof email !== "string") return "Email must be a string";

  const trimmed = email.trim();
  if (!trimmed) return "Email is required";
  // Domain check for admin or employee
  const domain = trimmed.split("@")[1] || "";
  if (type === "employee" && domain !== "spanemployee.com") {
    return "Employee email must end with @spanemployee.com";
  }

  return "";
};
// endregion


// region password validation
export const passwordValidation = (password = "") => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 128) {
    return "Password cannot exceed 128 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain a special character (!@#$%^&*)";
  }
  return "";
};
// endregion


// region department validation
export const departmentValidation = (department = "") => {
   const dept = department?.trim() ?? "";
  if (!dept) return "Department is required";
  if (!VALID_DEPARTMENTS.includes(dept)) return "Invalid department";
  return ""; // valid
};
// endregion

// region phone validation
export const phoneValidation = (phone = "") => {
  if (typeof phone !== "string") return "Phone must be a string";

  const trimmed = phone.trim();
  if (!trimmed) return "Phone number is required";
  if (!PHONE_REGEX.test(trimmed)) return "Enter a valid 10-digit Indian phone number";
  return "";
};
// endregion

// region address validation
export const addressValidation = (address = {}) => {
  if (typeof address !== "object" || address === null) return { general: "Address must be an object" };

  const errors = {};
  const { line1, line2, city, state, zip } = address;

  // line1
  if (!line1?.trim()) errors.line1 = "Address Line 1 is required";
  else if (line1.trim().length < 5) errors.line1 = "Address Line 1 must be at least 5 characters";
  else if (line1.trim().length > 100) errors.line1 = "Address Line 1 cannot exceed 100 characters";

  // line2 is optional
  if (line2 && line2.trim().length > 100) errors.line2 = "Address Line 2 cannot exceed 100 characters";

  // city
  if (!city?.trim()) errors.city = "City is required";
  else if (city.trim().length < 2) errors.city = "City must be at least 2 characters";
  else if (city.trim().length > 50) errors.city = "City cannot exceed 50 characters";
  else if (!CITY_STATE_REGEX.test(city.trim())) errors.city = "City can only contain letters and spaces";

  // state
  if (!state?.trim()) errors.state = "State is required";
  else if (state.trim().length < 2) errors.state = "State must be at least 2 characters";
  else if (state.trim().length > 50) errors.state = "State cannot exceed 50 characters";
  else if (!CITY_STATE_REGEX.test(state.trim())) errors.state = "State can only contain letters and spaces";

  // zip
  if (!zip?.trim()) errors.zip = "ZIP code is required";
  else if (!ZIP_REGEX.test(zip.trim())) errors.zip = "ZIP code must be 5 or 6 digits";

  return errors;
};
// endregion

// region full employee validation
export const validateEmployee = ({ name, email, department, phone, address }) => {
  const errors = {
    name: nameValidation(name),
    email: emailValidation(email),
    department: departmentValidation(department),
    phone: phoneValidation(phone),
    address: addressValidation(address),
  };

  // flatten address errors
  if (errors.address && typeof errors.address === "object") {
    Object.entries(errors.address).forEach(([key, val]) => {
      if (val) errors[`address.${key}`] = val;
    });
  }
  delete errors.address;

  // remove empty strings
  return Object.fromEntries(Object.entries(errors).filter(([_, val]) => val));
};
// endregion
