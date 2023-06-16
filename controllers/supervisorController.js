
const InternshipApplication = require('../models/internshipApplication');
const Internship = require('../models/internship');
const Supervisor = require('../models/supervisor');

const registerSupervisor = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Check if supervisor already exists
    const existingSupervisor = await Supervisor.findOne({ email });
    if (existingSupervisor) {
      return res.status(400).json({ error: 'Supervisor already exists' });
    }

    // Create a new supervisor
    const newSupervisor = new Supervisor({
      name,
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

// Controller function for changing the password
const changePassword = async (req, res) => {
  const { supervisorId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const supervisor = await Supervisor.findById(supervisorId);

    // Verify if the current password matches the stored password
    if (supervisor.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update the password
    supervisor.password = newPassword;

    // Save the updated user
    await supervisor.save();

    // Return success response
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Get all the students who are in the supervisors' department
const getDepartmentStudents = async (req, res) => {
  const supervisorId = req.params.supervisorId;

  try {
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ error: 'Supervisor not found' });
    }

    const departmentName = supervisor.departmentName;
    const students = await Student.find({ departmentName });

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



const getPendingApplications = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    // Find the supervisor by ID
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Get the departmentName from the supervisor
    const departmentName = supervisor.departmentName;

    // Find the students with the same departmentName
    const students = await Student.find({ departmentName });

    // Find the applications with the status 'Waiting for supervisor approval' from the students
    const applications = await InternshipApplication.find({
      student: { $in: students.map(student => student._id) },
      status: "Waiting for supervisor approval"
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error retrieving pending applications:', error);
    res.status(500).json({ error: 'Failed to retrieve pending applications' });
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

    // Get the department name
    const departmentName = supervisor.department.departmentName;

    // Find internships with matching department name
    const internships = await Internship.find({ 'student.departmentName': departmentName })
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
  changePassword,
  getDepartmentStudents,
  updateInternshipApplicationStatus,
  getPendingApplications
};
