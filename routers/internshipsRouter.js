const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const internshipController = require('../controllers/internshipController');


const {
  createInternship,
  getAllInternships,
  getInternshipById,
  deleteInternship,
  updateInternshipBookStatus,
  updateInternshipStatus,
} = require('../controllers/internshipController');

// Create a new internship
router.post('/internships/create/:id', createInternship);

// Get all internships
router.get('/internships', getAllInternships);

// Get a specific internship by ID
router.get('/internships/:id', getInternshipById);

// Delete an internship by ID
router.delete('/internships/:id', deleteInternship);

router.put('/internships/:internshipId',updateInternshipBookStatus)

// Update internship status
router.patch('/internship/:internshipId/status', updateInternshipStatus);


module.exports = router;
