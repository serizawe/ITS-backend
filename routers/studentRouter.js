const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  changePassword,
  createInternshipApplication,
  deleteInternshipApplication,
  getInternshipDetails,
  getAllAnnouncements,
  getStudentApplications 
} = require('../controllers/studentController');

// Create a new student
router.post('/students', createStudent);

// Get all students
router.get('/students', getAllStudents);

// Get a specific student by ID
router.get('/students/:id', getStudentById);

// Update a student
router.put('/students/:id', updateStudent);

// Delete a student
router.delete('/students/:id', deleteStudent);

// Change student's password
router.put('/students/:studentId/change-password', changePassword);


// Delete an internship application
router.delete('/students/internship-applications/:applicationId', deleteInternshipApplication);

// Get internship details for a student
router.get('/students/:studentId/internships/:internshipId', getInternshipDetails);

// Get all internship applications for a specific student
router.get('/students/:studentId/applications', getStudentApplications);


module.exports = router;
