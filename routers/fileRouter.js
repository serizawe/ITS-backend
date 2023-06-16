const express = require('express');
const multer = require('multer');
const evaluationController = require('../controllers/evaluationController');
const internshipController = require('../controllers/internshipController');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/internships/:internshipId/evaluation', upload.single('file'), async (req, res) => {
  try {
    const { internshipId } = req.params;
    const evaluationFile = req.file;

    await evaluationController.uploadEvaluationForm(internshipId, evaluationFile);

    res.status(200).json({ message: 'Evaluation form uploaded successfully' });
  } catch (error) {
    console.error('Error uploading evaluation form:', error);
    res.status(500).json({ error: 'Failed to upload evaluation form' });
  }
});

router.get('/internships/:internshipId/evaluation', (req, res) => {
  const { internshipId } = req.params;
  
  internshipController.downloadEvaluationForm(internshipId, res);
});

router.delete('/internships/:internshipId/evaluation', async (req, res) => {
  try {
    const { internshipId } = req.params;

    await evaluationController.deleteEvaluationForm(internshipId);

    res.status(200).json({ message: 'Evaluation form deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation form:', error);
    res.status(500).json({ error: 'Failed to delete evaluation form' });
  }
});

// Internship Book
router.post('/internships/:internshipId/internshipbook', upload.single('file'), async (req, res) => {
  try {
    const { internshipId } = req.params;
    const internshipBookFile = req.file;

    await internshipController.uploadInternshipBook(internshipId, internshipBookFile);

    res.status(200).json({ message: 'Internship Book uploaded successfully' });
  } catch (error) {
    console.error('Error uploading Internship Book:', error);
    res.status(500).json({ error: 'Failed to upload Internship Book' });
  }
});


// Route for downloading an internship book
router.get('/internships/:internshipId/internshipbook', (req, res) => {
  const { internshipId } = req.params;
  
  internshipController.downloadInternshipBook(internshipId, res);
});

router.delete('/internships/:internshipId/internshipbook', async (req, res) => {
  try {
    const { internshipId } = req.params;

    await internshipController.deleteInternshipBook(internshipId);

    res.status(200).json({ message: 'Internship Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting Internship Book:', error);
    res.status(500).json({ error: 'Failed to delete Internship Book' });
  }
});

module.exports = router;
