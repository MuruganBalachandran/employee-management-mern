// region imports

const {PASSWORD_REGEX,NAME_REGEX,EMAIL_REGEX}=   require('../utils/commonUtil');

// endregion

// region register validation
const validateRegister = (data = {}) => {
  const errors = {};
  const name = data?.name?.trim?.() ?? "";
  const email = data?.email?.trim?.() ?? "";
  const password = data?.password ?? "";

  // name
  if (!name) {
    errors.name = "Name is required";
  } else if (!NAME_REGEX.test(name)) {
    errors.name = "Name must be 2–50 characters and contain only letters";
  }

  // email
  if (!email) {
    errors.email = "Email is required";
  } else if (email.length > 100) {
    errors.email = "Email too long";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Invalid email format";
  } else if (!email.endsWith("@spanadmin.com")) {
    errors.email = "Admin email must end with @spanadmin.com";
  }

  // password
  if (!password) {
    errors.password = "Password is required";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "Password must be 8–16 chars, include upper, lower, number & special character";
  }

  return {
    valid: Object.keys(errors ?? {}).length === 0,
    errors,
  };
};
// endregion

// region login validation
const validateLogin = (data = {}) => {
  const errors = {};
  const email = data?.email?.trim?.() ?? "";
  const password = data?.password ?? "";


  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Invalid email format";
  } else if (
    !email.endsWith("@spanadmin.com") &&
    !email.endsWith("@spanemployee.com")
  ) {
    errors.email = "Email must be admin or employee domain";
  }


  if (!password) {
    errors.password = "Password is required";
  }

  return {
    valid: Object.keys(errors ?? {}).length === 0,
    errors,
  };
};
// endregion

// region exports
module.exports = { validateRegister, validateLogin };
// endregion
