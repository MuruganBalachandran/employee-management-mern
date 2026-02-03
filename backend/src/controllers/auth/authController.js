// region imports
// package imports
import {
  verifyPassword,
  generateToken,
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from '../../utils/index.js';

// validation imports
import {
  validateSignup,
  validateLogin,
  validateEmailDomain,
} from '../../validations/index.js';

// query imports
import {
  createUser,
  findUserByEmail,
} from '../../queries/index.js';
// endregion

// region signup controller
/**
 * Handles user registration / admin creation.
 */
const signup = async (req = {}, res = {}) => {
  try {
    // validate input against rules
    const validation = validateSignup(req.body || {});
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode || STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        validation.error || 'Invalid input'
      );
    }

    // extract fields with camelCase from req.body with defaults
    const {
      name = '',
      email = '',
      password = '',
      age = 0,
      department = '',
      phone = '',
      address = {},
      role = '',
    } = req.body || {};

    // Determine role based on security context:
    // - Public signup: strictly force 'employee'
    // - Super Admin: allow dynamic role (defaults to admin if used for creation)
    // - Admin: allow dynamic role (defaults to employee if used for creation)
    let finalRole = ROLE.EMPLOYEE;
    if (req.user && req.user.Role === ROLE.SUPER_ADMIN) {
      finalRole = role || ROLE.ADMIN;
    } else if (req.user && req.user.Role === ROLE.ADMIN) {
      finalRole = ROLE.EMPLOYEE;
    }

    // Placeholder logic for non-employees to satisfy strict model schema
    let finalDepartment = department;
    let finalPhone = phone;
    
    // Map address from camelCase (API) to PascalCase (DB)
    let finalAddress = address || {};
    if (address && typeof address === 'object') {
      finalAddress = {
        Line1: address.line1 || address.Line1 || '',
        City: address.city || address.City || '',
        State: address.state || address.State || '',
        ZipCode: address.zipCode || address.ZipCode || '',
      };
    }

    if (finalRole !== ROLE.EMPLOYEE) {
      finalDepartment = finalDepartment || 'Administration';
      finalPhone = finalPhone || '000-000-0000';
      if (!finalAddress.Line1) {
        finalAddress = {
          Line1: 'Admin HQ',
          City: 'Admin City',
          State: 'AD',
          ZipCode: '00000',
        };
      }
    }

    // Domain Validation based on Role
    const domainError = validateEmailDomain(email, finalRole);
    if (domainError) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, RESPONSE_STATUS.FAILURE, domainError);
    }

    // check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.CONFLICT,
        RESPONSE_STATUS.FAILURE,
        'Email already registered'
      );
    }

    // create user in DB (Model hook will handle hashing automatically)
    const user = await createUser({
      Name: name,
      Email: email,
      Password: password,
      Age: age,
      Role: finalRole,
      Department: finalDepartment,
      Phone: finalPhone,
      Address: finalAddress,
    });

    // generate JWT token for immediate login
    const token = generateToken(user._id.toString());

    // send success response
    const successMessage = finalRole === ROLE.EMPLOYEE
      ? 'User registered successfully'
      : 'Admin created successfully';
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      RESPONSE_STATUS.SUCCESS,
      successMessage,
      {
        user,
        token,
      }
    );
  } catch (err) {
    console.error('Error in signup:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error processing request'
    );
  }
};
// endregion

// region login controller
/**
 * Authenticates user and returns JWT token.
 */
const login = async (req = {}, res = {}) => {
  try {
    // validate login input
    const validation = validateLogin(req.body || {});
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode || STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        validation.error || 'Invalid input'
      );
    }

    const { email = '', password = '' } = req.body || {};

    // fetch user by email
    const user = await findUserByEmail(email);

    // verify password
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await verifyPassword(password, user.Password || "");
    }

    // send response for invalid credentials
    if (!user || !isPasswordValid) {
      console.log(`[Login Failed] Email: ${email}, UserFound: ${!!user}, PasswordValid: ${!!isPasswordValid}`);
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        RESPONSE_STATUS.FAILURE,
        'Invalid credentials'
      );
    }

    // generate JWT token (stateless)
    const token = generateToken(user._id.toString());

    // send success response
    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Login successful',
      {
        user,
        token,
      }
    );
  } catch (err) {
    console.error('Error in login:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error processing request'
    );
  }
};
// endregion

// region logout controller
/**
 * Log out user (Client-side token removal).
 */
const logout = async (req = {}, res = {}) => {
  try {
    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Logged out successfully'
    );
  } catch (err) {
    console.error('Error in logout:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error processing request'
    );
  }
};
// endregion

// region exports
export {
  signup,
  login,
  logout,
};
// endregion
