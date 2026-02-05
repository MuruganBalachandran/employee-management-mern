// region imports
// package imports
import {
  verifyPassword,
  generateToken,
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

// validation imports
import {
  validateLogin,
} from "../../validations/index.js";

// query imports
import { findUserByEmail } from "../../queries/index.js";
// endregion

// region login controller
const login = async (req = {}, res = {}) => {
  try {
    // validate login input
    const validation = validateLogin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode || STATUS_CODE?.BAD_REQUEST,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    const { email = "", password = "" } = req.body || {};

    // fetch user by email
    const user = await findUserByEmail(email);

    // verify password
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await verifyPassword(password, user?.Password || "");
    }

    // send response for invalid credentials
    if (!user || !isPasswordValid) {
      console.log(
        `[Login Failed] Email: ${email}, UserFound: ${!!user}, PasswordValid: ${!!isPasswordValid}`,
      );
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Invalid credentials",
      );
    }

    // generate JWT token (stateless)
    const token = generateToken(user?._id.toString());

    // send success response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Login successful",
      {
        user,
        token,
      },
    );
  } catch (err) {
    console.error("Error in login:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error processing request",
    );
  }
};
// endregion

// region logout controller
const logout = async (req = {}, res = {}) => {
  try {
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Logged out successfully",
    );
  } catch (err) {
    next(err);
  }
};
// endregion

// region exports
export { login, logout };
// endregion
