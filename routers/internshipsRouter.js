const express = require('express');
const internshipsController = require('../controllers/internships');
const router = express.Router();

// Create a new internship
router.post('/', createInternship);

// Get all internships
router.get('/', getAllInternships);

// Get a specific internship by ID
router.get('/:id', getInternshipById);

// Delete an internship by ID
router.delete('/:id', deleteInternship);

// Upload evaluation file for an internship
router.post('/upload-evaluation/:id', uploadEvaluation);

// Upload internship book file for an internship
router.post('/upload-internship-book/:id', uploadInternshipBook);

module.exports = router;