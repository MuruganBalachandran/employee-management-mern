// region package imports
import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";
import { RESPONSE_STATUS } from "../../utils/constants/constants.js";
// endregion

// region UTILS
/**
 * Builds a composite key using IP + Email.
 * This protects against:
 *  - IP rotation
 *  - email brute-force
 *  - credential stuffing
 */
const buildKey = (req) => {
  const ip = ipKeyGenerator(req);
  const email = req.body?.Email?.toLowerCase() || "no-email";
  return `${ip}|${email}`;
};
// endregion

// region LOGIN LIMITER
/**
 * Protects login endpoint
 * 5 attempts per IP+Email per 10 minutes
 */
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildKey,
  message: {
    status: RESPONSE_STATUS.FAILURE,
    message: "Too many login attempts. Try again later.",
  },
});
// endregion

// region SIGNUP LIMITER
/**
 * Protects signup endpoint
 * 3 attempts per IP+Email per 1 hour
 */
const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildKey,
  message: {
    status: RESPONSE_STATUS.FAILURE,
    message: "Too many signup attempts. Try again later.",
  },
});
// endregion

// region exports
export {
  loginLimiter,
  signupLimiter,
};
// endregion
