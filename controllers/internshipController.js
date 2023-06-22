const Internship = require('../models/internship');
const InternshipApplication = require('../models/internshipApplication');


// Convert an application to an internship
const createInternship = async (req, res) => {
  try {
    const application = await InternshipApplication.findById(req.params.id)
      .populate('student')
      .populate('announcement');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { student, announcement } = application;

    const internshipData = {
      student: student._id,
      company: announcement.company,
      startDate: announcement.dateRange1,
      endDate: announcement.dateRange2,
      internshipName: announcement.internshipName,
      internshipType: announcement.internshipType,
      internshipProgram: announcement.internshipProgram,
      insuranceSituation: announcement.insuranceSituation,
      departmentNames: announcement.departmentNames,
      studentDepartmentNames: announcement.studentDepartmentNames,
      evaluation: '', 
      internshipBook: '', 
    };

    const internship = new Internship(internshipData);
    const savedInternship = await internship.save();

    application.status = 'Approved';
    await application.save();

    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all internships
const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('student', 'name') 
      .populate('company', 'name') 
      .populate('supervisor', 'name'); 
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific internship by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('student', 'name') 
      .populate('company', 'name') 
      .populate('supervisor', 'name'); 
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an internship by ID
const deleteInternship = async (req, res) => {
  try {
    const deletedInternship = await Internship.findByIdAndRemove(req.params.id);
    if (!deletedInternship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update internship book status
const updateInternshipBookStatus = async (internshipId, newStatus, rejectionReason) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      throw new Error('Internship not found');
    }

    internship.internshipBookStatus = newStatus;
    if (rejectionReason) {
      internship.bookComment = rejectionReason;
    }

    await internship.save();
    return internship;
  } catch (error) {
    throw new Error(`Error updating internship book status: ${error.message}`);
  }
};

const updateInternshipStatus = async (req, res) => {
  const internshipId = req.params.internshipId;
  const { status, comment } = req.body;
  try {
    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    internship.status = status;
    internship.comment = comment;
    await internship.save();

    res.status(200).json(internship);
  } catch (error) {
    console.error('Error updating internship status:', error);
    res.status(500).json({ error: 'An error occurred while updating internship status' });
  }
};




module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  deleteInternship,
  updateInternshipBookStatus,
  updateInternshipStatus
};
