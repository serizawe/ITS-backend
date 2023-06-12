const express = require('express');
const router = express.Router();
const internshipApplicationController = require('../controllers/internshipApplicationController');

// GET all internship applications
router.get('/internship-applications', internshipApplicationController.getAllInternshipApplications);

// GET all internship applications for a specific company
router.get('/companies/:companyId/applications', internshipApplicationController.getAllInternshipApplications);

// DELETE an internship application
router.delete('/internship-applications/:id', internshipApplicationController.deleteInternshipApplication);

module.exports = router;
