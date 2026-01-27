// region imports
const express = require("express");
const { register, login, logout, getCurrentUser } = require("../controllers/authController");
const validateJson = require("../middlewares/validateJson");
const { validateRegister, validateLogin } = require("../validations/authValidation");
const { auth } = require("../middlewares/authMiddleware");
// endregion

// region router
const router = express.Router();

// register
router.post("/register", validateJson(validateRegister), register);

// login
router.post("/login", validateJson(validateLogin), login);

// logout (protected route, no body validation needed)
router.post("/logout", auth, logout);

// get current logged-in user (protected route)
router.get("/me", auth, getCurrentUser);
// endregion

// region exports
module.exports = router;
// endregion
