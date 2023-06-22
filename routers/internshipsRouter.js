const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');
const internshipController = require('../controllers/internshipController');
const upload = multer({ storage: multer.memoryStorage() });

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

router.put('/internships/:internshipId', async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { newStatus, rejectionReason } = req.body; // Extract newStatus and rejectionReason from the request body
    const updatedInternship = await updateInternshipBookStatus(internshipId, newStatus, rejectionReason);
    res.json(updatedInternship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update internship status
router.patch('/internships/:internshipId/status', updateInternshipStatus);


// Internship Book
router.post('/internships/:internshipId/internshipbook', upload.single('file'), async (req, res) => {
  try {
    const { internshipId } = req.params;
    const internshipBookFile = req.file;
    await fileController.uploadInternshipBook(internshipId, internshipBookFile);

    res.status(200).json({ message: 'Internship Book uploaded successfully' });
  } catch (error) {
    console.error('Error uploading Internship Book:', error);
    res.status(500).json({ error: 'Failed to upload Internship Book' });
  }
});

// Route for downloading an internship book
router.get('/internships/:internshipId/internshipbook', (req, res) => {
  const { internshipId } = req.params;
  fileController.downloadInternshipBook(internshipId, res);
});

// Delete the Internship Book
router.delete('/internships/:internshipId/internshipbook', async (req, res) => {
  try {
    const { internshipId } = req.params;
    await fileController.deleteInternshipBook(internshipId);
    res.status(200).json({ message: 'Internship Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting Internship Book:', error);
    res.status(500).json({ error: 'Failed to delete Internship Book' });
  }
});

// Evaluation Form
router.post('/internships/:internshipId/evaluationform', upload.single('file'), async (req, res) => {
  try {
    const { internshipId } = req.params;
    const evaluationFormFile = req.file;
    console.log(evaluationFormFile);
    await fileController.uploadEvaluationForm(internshipId, evaluationFormFile);
    
    res.status(200).json({ message: 'Evaluation Form uploaded successfully' });
  } catch (error) {
    console.error('Error uploading Evaluation Form:', error);
    res.status(500).json({ error: 'Failed to upload Evaluation Form' });
  }
});

// Route for downloading an evaluation form
router.get('/internships/:internshipId/evaluationform', (req, res) => {
  const { internshipId } = req.params;
  fileController.downloadEvaluationForm(internshipId, res);
});

// Delete the Evaluation Form
router.delete('/internships/:internshipId/evaluationform', async (req, res) => {
  try {
    const { internshipId } = req.params;
    await fileController.deleteEvaluationForm(internshipId);
    res.status(200).json({ message: 'Evaluation Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting Evaluation Form:', error);
    res.status(500).json({ error: 'Failed to delete Evaluation Form' });
  }
});




module.exports = router;
