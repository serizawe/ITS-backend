const express = require('express');
const router = express.Router();
const internshipAnnouncementController = require('../controllers/internshipAnnouncementController');

// POST a new internship announcement
router.post('/internship-announcements', internshipAnnouncementController.createInternshipAnnouncement);

// GET all internship announcements
router.get('/companies/:companyId/announcements', internshipAnnouncementController.getCompanyAnnouncements);


// PUT/update an internship announcement
router.put('/internship-announcements/:id', internshipAnnouncementController.updateInternshipAnnouncement);

// DELETE an internship announcement
router.delete('/internship-announcements/:id', internshipAnnouncementController.deleteInternshipAnnouncement);

module.exports = router;
