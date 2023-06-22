const InternshipApplication = require('../models/internshipApplication');
const InternshipAnnouncement = require('../models/internshipAnnouncement');
const Student = require('../models/student');


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

const createInternshipApplication = async (req, res) => {
  try {
    const { studentId, announcementId } = req.body;
    console.log(studentId,announcementId);
    // Check if the student and announcement exist
    const student = await Student.findById(studentId);
    const announcement = await InternshipAnnouncement.findById(announcementId);
    if (!student || !announcement) {
      return res.status(404).json({ message: 'Student or Announcement not found' });
    }

    // Check if the student has already applied to the announcement
    const existingApplication = await InternshipApplication.findOne({
      student: studentId,
      announcement: announcementId
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this announcement' });
    }

    // Create the internship application
    const internshipApplication = new InternshipApplication({
      student: studentId,
      announcement: announcementId,
      status: 'Pending',
      internship: null
    });

    // Add the internship application to the announcement's applications array
    announcement.applications.push(internshipApplication);

    // Save the internship application and update the announcement
    await Promise.all([internshipApplication.save(), announcement.save()]);

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

    // Remove the internship application from the announcement's applications 
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


const updateInternshipApplicationStatus = async (req, res) => {
  try {

    const { applicationId } = req.params;
    const { status } = req.body;
    console.log(applicationId.status);
    // Check if the internship application exists
    const internshipApplication = await InternshipApplication.findById(applicationId);
    if (!internshipApplication) {
      return res.status(404).json({ message: 'Internship Application not found' });
    }

    // Update the status field of the internship application
    internshipApplication.status = status;
    await internshipApplication.save();

    res.status(200).json({ message: 'Internship Application status updated successfully', data: internshipApplication });
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
  updateInternshipApplicationStatus
};
