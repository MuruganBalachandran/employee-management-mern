// region imports
// package imports
import express from 'express';

// middleware imports
import { auth } from '../../middleware/index.js'; // verifies JWT and attaches req.user

// controller imports
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from '../../controllers/user/userController.js';
// endregion

// region router initialization
const router = express.Router();
// endregion

// region protected routes
/**
 * Protected routes: Requires valid JWT token.
 */

// fetch logged-in user's profile
router.get('/getProfile', auth(), getProfile);

// update logged-in user's profile
router.patch('/updateProfile', auth(), updateProfile);

// permanently delete or soft-delete user account
router.delete('/deleteProfile', auth(), deleteAccount);

// endregion

// region exports
export default router;
// endregion
