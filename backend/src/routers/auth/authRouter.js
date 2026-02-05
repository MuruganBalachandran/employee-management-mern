// region imports
// package imports
import express from "express";

// controller imports
import {
  login,
  logout,
} from "../../controllers/auth/authController.js";

// middleware imports
import { auth } from "../../middleware/index.js";

// rate limiter imports
import { loginLimiter } from "../../middleware/index.js";

// region router initialization
const router = express.Router();
// endregion

//  public routes
// Signup is disabled for public. Admins are created by SuperAdmin, Employees by Admins.
router.post("/login", loginLimiter, login);

// protected routes
router.post("/logout", auth(), logout);
// endregion

// region exports
export default router;
// endregion
