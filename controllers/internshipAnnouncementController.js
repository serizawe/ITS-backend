const InternshipAnnouncement = require('../models/internshipAnnouncement');
const InternshipApplication = require('../models/internshipApplication');
const company = require('../models/company');

// Create a new internship announcement 
const createInternshipAnnouncement = async (req, res) => {
  try {
    const {
      internshipName,
      internshipType,
      internshipProgram,
      insuranceSituation,
      RangePicker1,
      RangePicker2,
      departmentName,
      studentDepartmentName,
    } = req.body;

    const companyId = req.params.companyId; // Extract the companyId from the request parameters

    const newAnnouncement = new InternshipAnnouncement({
      company: companyId,
      internshipName,
      internshipType,
      internshipProgram,
      insuranceSituation,
      dateRange1: new Date(RangePicker1[0]), 
      dateRange2: new Date(RangePicker2[0]), 
      departmentNames: departmentName,
      studentDepartmentNames: studentDepartmentName,
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all internship announcements
const getAllInternshipAnnouncements = async (req, res) => {
  try {
    const announcements = await InternshipAnnouncement.find()
      .populate("company", "companyName sector location") // Populate the company field with specified fields
      .exec();
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error getting internship announcements:', error);
    res.status(500).json({ error: 'An error occurred while fetching internship announcements' });
  }
};



// Get all internship announcements for a company
const getCompanyAnnouncements = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const announcements = await InternshipAnnouncement.find({ company: companyId });

    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error getting company announcements:', error);
    res.status(500).json({ error: 'An error occurred while fetching company announcements' });
  }
};

// Delete an internship announcement
const deleteInternshipAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnnouncement = await InternshipAnnouncement.findByIdAndDelete(id);

    if (deletedAnnouncement) {
      res.json({ message: 'Internship announcement deleted successfully' });
    } else {
      res.status(404).json({ error: 'Internship announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAnnouncementApplications = async (req, res) => {
  const announcementId = req.params.announcementId;

  try {
    const applications = await InternshipApplication.find({ announcement: announcementId, status: 'Pending' })
      .populate({
        path: 'student',
        select: 'name surname gpa classYear departmentName email phone address' // Specify the fields you want to populate
      })
      .exec();

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting announcement applications:', error);
    res.status(500).json({ error: 'An error occurred while fetching announcement applications' });
  }
};



// Update an internship announcement
const updateInternshipAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      sector,
      location,
      contactNumber,
      applications,
      internshipName, 
      internshipType, 
      internshipProgram, 
      insuranceSituation, 
      dateRange1, 
      dateRange2, 
      departmentNames, 
      studentDepartmentNames, 
    } = req.body;

    const updatedAnnouncement = await InternshipAnnouncement.findByIdAndUpdate(
      id,
      {
        $set: {
          company,
          sector,
          location,
          contactNumber,
          applications,
          internshipName,
          internshipType,
          internshipProgram,
          insuranceSituation,
          dateRange1,
          dateRange2,
          departmentNames,
          studentDepartmentNames,
        },
      },
      { new: true }
    );

    if (updatedAnnouncement) {
      res.json(updatedAnnouncement);
    } else {
      res.status(404).json({ error: 'Internship announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCompanyAnnouncements,
  createInternshipAnnouncement,
  updateInternshipAnnouncement,
  deleteInternshipAnnouncement,
  getAnnouncementApplications,
  getAllInternshipAnnouncements
};
