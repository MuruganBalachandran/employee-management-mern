// region regex constants

const NAME_REGEX = /^[A-Za-z0-9 ]{2,50}$/;

const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile

const ZIP_REGEX = /^\d{5,6}$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,16}$/;

// Proper email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// endregion

// region exports
module.exports = {
  NAME_REGEX,
  PHONE_REGEX,
  ZIP_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
};
// endregion
