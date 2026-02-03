// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
} from '../helpers/typeValidations.js';

import { validationError } from '../helpers/validationError.js';
import { VALIDATION_MESSAGES } from '../../utils/index.js';
// endregion

// region validate signup
/**
 * Validates user signup data.
 * Checks Name, Email, Password, and Age requirements.
 */
const validateSignup = (data = {}) => {
  const errors = [];

  const { name = "", email = "", password = "", age, department, phone, address } = data || {};

  // region Name
  const nameError = validateName(name);
  if (nameError) {
    errors.push(nameError);
  }
  // endregion

  // region Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push(emailError);
  }
  // endregion

  // region Password
  const passwordError = validatePassword(password, { name, email });
  if (passwordError) {
    errors.push(passwordError);
  }
  // endregion

  // region Age (optional)
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.push(ageError);
    }
  }
  // endregion

  // region Department
  if (department !== undefined) {
    // Optional for general signup, but forced for employee creation - logic in controller determines role
    const deptError = validateDepartment(department);
    if (deptError) {
      errors.push(deptError);
    }
  }
  // endregion

  // region Phone
  if (phone !== undefined) {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      errors.push(phoneError);
    }
  }
  // endregion

  // region Address
  if (address !== undefined) {
    const addressError = validateAddress(address);
    if (addressError) {
      errors.push(addressError);
    }
  }
  // endregion

  // region result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region validate login
/**
 * Validates user login credentials.
 * Ensures Email and Password presence and correct format.
 */
const validateLogin = (data = {}) => {
  const errors = [];

  const { email, password } = data || {};

  // region Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push(emailError);
  }
  // endregion

  // region Password (only presence check through validator)
  const passwordError = validatePassword(password);
  if (passwordError && passwordError === (VALIDATION_MESSAGES?.PASSWORD_REQUIRED || 'Password is required')) {
    errors.push(passwordError);
  }
  // endregion

  // region result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region exports
export {
  validateSignup,
  validateLogin,
};
// endregion
