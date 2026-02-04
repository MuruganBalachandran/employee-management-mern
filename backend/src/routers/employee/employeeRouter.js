// region imports
// package imports
import express from 'express';

// middleware imports
import { auth } from '../../middleware/index.js';

// controller imports
import {
  listEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployeeDetails,
  removeEmployee,
} from '../../controllers/employee/employeeController.js';
// endregion

// region router initialization
const router = express.Router();
// endregion

// All routes here require Admin access
router.get('/', auth('ADMIN', 'SUPER_ADMIN'), listEmployees);
router.get('/:id', auth('ADMIN', 'SUPER_ADMIN'), getEmployee);
router.post('/', auth('ADMIN', 'SUPER_ADMIN'), createNewEmployee);
router.patch('/:id', auth('ADMIN', 'SUPER_ADMIN'), updateEmployeeDetails);
router.delete('/:id', auth('ADMIN', 'SUPER_ADMIN'), removeEmployee);

export default router;
