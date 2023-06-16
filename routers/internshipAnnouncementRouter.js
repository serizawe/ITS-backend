const express = require('express');
const router = express.Router();
const {
  getCompanyAnnouncements,
  createInternshipAnnouncement,
  updateInternshipAnnouncement,
  deleteInternshipAnnouncement,
  getAnnouncementApplications,
  getAllInternshipAnnouncements
} = require('../controllers/internshipAnnouncementController');

const internshipAnnouncementController = require('../controllers/internshipAnnouncementController');

// Create a new internship announcement
router.post('/companies/:companyId/internship-announcements', internshipAnnouncementController.createInternshipAnnouncement);

// Create a new internship announcement
router.post('/internship-announcements', createInternshipAnnouncement);

// Get all internship announcements
router.get('/internship-announcements', getAllInternshipAnnouncements);

// Get all internship announcements for a company
router.get('/internship-announcements/:companyId', getCompanyAnnouncements);

// Get internship applications for a specific announcement
router.get('/internship-announcements/:announcementId/applications', getAnnouncementApplications);

// Update an internship announcement
router.patch('/internship-announcements/:id', updateInternshipAnnouncement);

// Delete an internship announcement
router.delete('/internship-announcements/:id', deleteInternshipAnnouncement);

module.exports = router;
