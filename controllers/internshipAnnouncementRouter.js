const InternshipAnnouncement = require('../models/internshipAnnouncement');

// Create a new internship announcement
const createInternshipAnnouncement = async (req, res) => {
  try {
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

    const newAnnouncement = new InternshipAnnouncement({
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
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all internship announcements
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
};
