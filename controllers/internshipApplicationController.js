const InternshipApplication = require('../models/internshipApplication');
const InternshipAnnouncement = require('../models/internshipAnnouncement');

//Get all applications for a specific company
const getCompanyApplications = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const companyAnnouncements = await InternshipAnnouncement.find({ company: companyId });

    const announcementIds = companyAnnouncements.map((announcement) => announcement._id);

    const applications = await InternshipApplication.find({ announcement: { $in: announcementIds } })
      .populate('student')
      .populate('announcement')
      .populate('internship');

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting company applications:', error);
    res.status(500).json({ error: 'An error occurred while fetching company applications' });
  }
};

// Create an internship application
const createInternshipApplication = async (req, res) => {
  try {
    const { studentId, announcementId } = req.body;

    // Check if the student and announcement exist
    const student = await Student.findById(studentId);
    const announcement = await InternshipAnnouncement.findById(announcementId);
    if (!student || !announcement) {
      return res.status(404).json({ message: 'Student or Announcement not found' });
    }

    // Create the internship application
    const internshipApplication = new InternshipApplication({
      student: studentId,
      announcement: announcementId,
      status: 'Pending',
      internship: null
    });

    // Add the internship application to the announcement's applications array
    announcement.applications.push(internshipApplication._id);

    // Save the internship application and update the announcement
    await internshipApplication.save();
    await announcement.save();

    res.status(201).json(internshipApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an internship application
const deleteInternshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if the internship application exists
    const internshipApplication = await InternshipApplication.findById(applicationId);
    if (!internshipApplication) {
      return res.status(404).json({ message: 'Internship Application not found' });
    }

    // Remove the internship application from the announcement's applications array
    const announcement = await InternshipAnnouncement.findById(internshipApplication.announcement);
    announcement.applications = announcement.applications.filter(appId => appId.toString() !== applicationId);
    await announcement.save();

    // Delete the internship application
    await InternshipApplication.findByIdAndDelete(applicationId);

    res.status(200).json({ message: 'Internship Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an internship application
const updateInternshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const updateData = req.body;

    // Check if the internship application exists
    const internshipApplication = await InternshipApplication.findById(applicationId);
    if (!internshipApplication) {
      return res.status(404).json({ message: 'Internship Application not found' });
    }

    // Update the internship application
    const updatedApplication = await InternshipApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: 'Internship Application updated successfully', data: updatedApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all internship applications
const getAllInternshipApplications = async (req, res) => {
  try {
    const applications = await InternshipApplication.find()
      .populate('student', 'name') // Populate the 'student' field with the 'name' property
      .populate('announcement', 'title') // Populate the 'announcement' field with the 'title' property
      .populate('internship', 'name'); // Populate the 'internship' field with the 'name' property
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  getCompanyApplications,
  getAllInternshipApplications,
  createInternshipApplication,
  deleteInternshipApplication,
  updateInternshipApplication
};
