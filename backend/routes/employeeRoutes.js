import express from 'express';
import upload from '../middleware/upload.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', upload.single('profileImage'), createEmployee);
router.put('/:id', upload.single('profileImage'), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
