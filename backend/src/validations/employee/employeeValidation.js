// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
  validateEmailDomain,
  validateObjectId,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { VALIDATION_MESSAGES, ROLE } from "../../utils/index.js";
// endregion

// region validate create employee
const validateCreateEmployee = (data = {}) => {
  const errors = {};

  // extract values from body
  const {
    name = "",
    email = "",
    password = "",
    age = undefined,
    department = "",
    phone = "",
    address = {},
  } = data || {};

  // Name
  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  // Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  } else {
    // Check domain specific to employees
    const domainError = validateEmailDomain({ email, role: ROLE.EMPLOYEE });
    if (domainError) errors.email = domainError;
  }

  // Password
  const passwordError = validatePassword(password || "", {
    name,
    email,
  });
  if (passwordError) {
    errors.password = passwordError;
  }

  // Age (Optional)
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.age = ageError;
    }
  }

  // Department (Required for Employee)
  const deptError = validateDepartment(department);
  if (deptError) {
    errors.department = deptError;
  }

  // Phone (Required for Employee)
  const phoneError = validatePhone(phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  // Address (Required for Employee)
  const addressError = validateAddress(address);
  if (addressError) {
    errors.address = addressError;
  }

  const { salary, joiningDate, reportingManager, isActive } = data;

  if (salary === undefined || salary === null || salary === "")
  errors.salary = "Salary is required";
else if (isNaN(salary))
  errors.salary = "Salary must be a number";
else if (Number(salary) <= 0)
  errors.salary = "Salary must be greater than 0";

if (!joiningDate) {
  errors.joiningDate = "Joining date is required";
} else {
  const date = new Date(joiningDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  date.setHours(0,0,0,0);

  if (isNaN(date.getTime())) errors.joiningDate = "Invalid date";
  else if (date < today) errors.joiningDate = "Joining date cannot be in the past";
}

  // reportingManager is optional, no validation needed (just a string ID)
  if (isActive !== undefined && ![0, 1].includes(isActive)) errors.isActive = "Is Active must be 0 or 1";

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate update employee
const validateUpdateEmployee = (data = {}) => {
  const errors = {};

  const { name, age, department, phone, address,salary, reportingManager, joiningDate, employeeCode } = data || {};

  if (name !== undefined) {
    const nameError = validateName(name);
    if (nameError) {
      errors.name = nameError;
    }
  }

  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.age = ageError;
    }
  }

  if (department !== undefined) {
    const deptError = validateDepartment(department);
    if (deptError) {
      errors.department = deptError;
    }
  }

  if (phone !== undefined) {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }

  if (address !== undefined) {
    const addressError = validateAddress(address);
    if (addressError) {
      errors.address = addressError;
    }
  }

  if (salary !== undefined) {
  if (isNaN(salary) || Number(salary) <= 0)
    errors.salary = "Salary must be greater than 0";
}

if (joiningDate !== undefined) {
  const date = new Date(joiningDate);
  if (isNaN(date.getTime())) errors.joiningDate = "Invalid joining date";
}

if (reportingManager !== undefined && !validateObjectId(reportingManager))
  errors.reportingManager = "Invalid reporting manager ID";

if (employeeCode !== undefined && employeeCode.trim() === "")
  errors.employeeCode = "Employee code cannot be empty";


  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateEmployee, validateUpdateEmployee };
// endregion
