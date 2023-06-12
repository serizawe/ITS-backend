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


// Handle the upload of the evaluation file
const uploadEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);

    if (req.file) {
      const evaluationFile = {
        filename: req.file.filename,
        path: req.file.path,
      };
      internship.evaluation = evaluationFile;
    }

    const updatedInternship = await internship.save();

    res.status(200).json(updatedInternship);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle the upload of the internship book file
const uploadInternshipBook = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);

    if (req.file) {
      const internshipBookFile = {
        filename: req.file.filename,
        path: req.file.path,
      };
      internship.internshipBook = internshipBookFile;
    }
    const updatedInternship = await internship.save();

    res.status(200).json(updatedInternship);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  deleteInternship,
  uploadEvaluation,
  uploadInternshipBook,
};
