const express = require('express');
const router = express.Router();
const {
  getCompanyApplications,
  getAllInternshipApplications,
  createInternshipApplication,
  deleteInternshipApplication,
  updateInternshipApplicationStatus,
  getStudentApplications
} = require('../controllers/internshipApplicationController');

// Get all applications for a specific company
router.get('/company-applications/:companyId', getCompanyApplications);

// Get all internship applications
router.get('/internship-applications', getAllInternshipApplications);

// Create a new internship application
router.post('/internship-applications/apply', createInternshipApplication);

// Delete an internship application
router.delete('/internship-applications/:applicationId', deleteInternshipApplication);

// Update the status of an internship application
router.patch('/internship-applications/:applicationId', updateInternshipApplicationStatus);

module.exports = router;
