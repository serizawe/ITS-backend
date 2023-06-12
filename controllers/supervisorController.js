const Department = require('../models/department');
const InternshipApplication = require('../models/internshipApplication');
const Internship = require('../models/internship');
const Supervisor = require('../models/supervisor');

const registerSupervisor = async (req, res) => {
  try {
    const { supervisorname, surname, email, password } = req.body;

    // Check if supervisor already exists
    const existingSupervisor = await Supervisor.findOne({ email });
    if (existingSupervisor) {
      return res.status(400).json({ error: 'Supervisor already exists' });
    }

    // Create a new supervisor
    const newSupervisor = new Supervisor({
      supervisorname,
      surname,
      email,
      password
    });

    // Save the supervisor to the database
    await newSupervisor.save();

    res.status(201).json({ message: 'Supervisor registered successfully' });
  } catch (error) {
    console.error('Error registering supervisor:', error);
    res.status(500).json({ error: 'An error occurred while registering supervisor' });
  }
};

// Get a specific supervisor by ID
const getSupervisorById = async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const supervisor = await Supervisor.findById(supervisorId);
    
    if (supervisor) {
      res.status(200).json(supervisor);
    } else {
      res.status(404).json({ error: 'Supervisor not found' });
    }
  } catch (error) {
    console.error('Error getting supervisor:', error);
    res.status(500).json({ error: 'An error occurred while fetching supervisor' });
  }
};

// Update a supervisor
const updateSupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const { supervisorname, surname, email, password } = req.body;

    const updatedSupervisor = await Supervisor.findByIdAndUpdate(
      supervisorId,
      {
        supervisorname,
        surname,
        email,
        password
      },
      { new: true }
    );

    if (updatedSupervisor) {
      res.status(200).json(updatedSupervisor);
    } else {
      res.status(404).json({ error: 'Supervisor not found' });
    }
  } catch (error) {
    console.error('Error updating supervisor:', error);
    res.status(500).json({ error: 'An error occurred while updating supervisor' });
  }
};

// Get all the students who are in the supervisors' department
const getDepartmentStudents = async (req, res) => {
  const supervisorId = req.params.supervisorId;

  try {
    const department = await Department.findOne({ supervisor: supervisorId }).populate('students');

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const students = department.students;

    res.status(200).json(students);
  } catch (error) {
    console.error('Error getting department students:', error);
    res.status(500).json({ error: 'An error occurred while fetching department students' });
  }
};


const updateInternshipApplicationStatus = async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status, comment } = req.body;

  try {
    const application = await InternshipApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Internship application not found' });
    }

    application.status = status;
    application.comment = comment;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.error('Error updating internship application status:', error);
    res.status(500).json({ error: 'An error occurred while updating internship application status' });
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

const getInternshipsBySupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.supervisorId;
    
    // Find the supervisor by ID
    const supervisor = await Supervisor.findById(supervisorId).populate('department');
    
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }
    
    // Get the department ID
    const departmentId = supervisor.department._id;
    
    // Find internships with matching department ID
    const internships = await Internship.find({ 'student.department': departmentId })
      .populate('student')
      .populate('company')
      .populate('supervisor');
    
    return res.json({ internships });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  registerSupervisor,
  getSupervisorById,
  getInternshipsBySupervisor,
  updateSupervisor,  
  getDepartmentStudents,
  updateInternshipApplicationStatus,
  updateInternshipStatus,
};