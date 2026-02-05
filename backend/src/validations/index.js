// region barrel exports
export { validateSignup, validateLogin } from './auth/authValidation.js';
export { validateCreateEmployee, validateUpdateEmployee } from './employee/employeeValidation.js';
export { validatePhone, validateAddress, validateEmailDomain } from './helpers/typeValidations.js';
export { validationError } from './helpers/validationError.js';
export { validateUpdateProfile } from './user/userValidation.js';
export { validateCreateAdmin } from './superAdmin/superAdminValidation.js';
// endregion
