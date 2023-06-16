const express = require('express');
const router = express.Router();
const {
  registerSupervisor,
  getSupervisorById,
  getInternshipsBySupervisor,
  updateSupervisor,
  changePassword,
  getDepartmentStudents,
  updateInternshipApplicationStatus,
  getPendingApplications
} = require('../controllers/supervisorController');

// Register a supervisor
router.post('/supervisors/register', registerSupervisor);

// Get a specific supervisor by ID
router.get('/supervisors/:id', getSupervisorById);

// Get internships by supervisor
router.get('/supervisors/:supervisorId/internships', getInternshipsBySupervisor);

// Update a supervisor
router.put('/supervisors/:id', updateSupervisor);

// Change supervisor password
router.put('/supervisors/:supervisorId/change-password', changePassword);

// Get department students
router.get('/supervisors/:supervisorId/students', getDepartmentStudents);

// Get pending applications for a supervisor
router.get('/supervisors/:supervisorId/pending-applications', getPendingApplications);

module.exports = router;
