// Salary validation
export const salaryValidation = (salary = "") => {
  if (!salary) return ""; // Optional field

  const num = parseFloat(salary);
  
  if (isNaN(num)) {
    return "Salary must be a valid number";
  }

  if (num < 0) {
    return "Salary cannot be negative";
  }

  if (num > 10000000) {
    return "Salary seems unreasonably high";
  }

  return "";
};

// Reporting manager validation
export const reportingManagerValidation = (managerId = "") => {
  if (!managerId) return ""; // Optional field

  const trimmed = managerId?.trim() ?? "";

  if (trimmed.length < 2) {
    return "Manager ID must be at least 2 characters";
  }

  if (trimmed.length > 50) {
    return "Manager ID cannot exceed 50 characters";
  }

  return "";
};

// Joining date validation
export const joiningDateValidation = (date = "") => {
  if (!date) return ""; // Optional field

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date format";
  }

  const minDate = new Date("2000-01-01");

  if (dateObj < minDate) {
    return "Joining date cannot be before year 2000";
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (dateObj > maxDate) {
    return "Joining date cannot be more than 1 year in the future";
  }

  return "";
};
