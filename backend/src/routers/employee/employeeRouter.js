import express from 'express';
import { auth } from '../../middleware/index.js';

import {
  listEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployeeDetails,
  removeEmployee,
} from '../../controllers/employee/employeeController.js';

const router = express.Router();

// All routes here require Admin access
router.get('/', auth('ADMIN', 'SUPER_ADMIN'), listEmployees);
router.get('/:id', auth('ADMIN', 'SUPER_ADMIN'), getEmployee);
router.post('/', auth('ADMIN', 'SUPER_ADMIN'), createNewEmployee);
router.patch('/:id', auth('ADMIN', 'SUPER_ADMIN'), updateEmployeeDetails);
router.delete('/:id', auth('ADMIN', 'SUPER_ADMIN'), removeEmployee);

export default router;
