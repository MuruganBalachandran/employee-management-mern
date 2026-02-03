// region imports
import express from 'express';
import { auth } from '../../middleware/index.js';
import { createAdmin, removeAdmin } from '../../controllers/user/superAdminController.js';
// endregion

// region router initialization
const router = express.Router();
// endregion

// region super admin routes
/**
 * Routes strictly reserved for the Super Admin.
 */

// Only Super Admin can create Admin accounts
router.post('/create-admin', auth('SUPER_ADMIN'), createAdmin);

// Only Super Admin can delete Admin accounts
router.delete('/delete-admin/:id', auth('SUPER_ADMIN'), removeAdmin);
// endregion

// region exports
export default router;
// endregion
