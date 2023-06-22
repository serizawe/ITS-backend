
const InternshipApplication = require('../models/internshipApplication');
const Internship = require('../models/internship');
const Supervisor = require('../models/supervisor');
const Student = require('../models/student');
const InternshipAnnouncement = require('../models/internshipAnnouncement');
const bcrypt = require('bcrypt');

const registerSupervisor = async (req, res) => {
  try {
    const { name, surname, email, password ,departmentName} = req.body;

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
      password,
      departmentName
    });

    // Save the supervisor to the database
    await newSupervisor.save();

    res.status(201).json({ message: 'Supervisor registered successfully' });
  } catch (error) {
    console.error('Error registering supervisor:', error);
    res.status(500).json({ error: 'An error occurred while registering supervisor' });
  }
};
 
// Get a supervisor by id
const getSupervisorById = async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const supervisor = await Supervisor.findById(supervisorId).select('-password');
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
    // Find the supervisor by ID
    const supervisor = await Supervisor.findById(supervisorId);

    // Check if the current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, supervisor.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }


    // Update the password
    supervisor.password = newPassword;

    // Save the updated supervisor
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

    // Find the applications with the status 'Waiting for supervisor approval' or 'Approved' from the students
    const applications = await InternshipApplication.find({
      student: { $in: students.map(student => student._id) },
       status: { $in: ['Waiting for supervisor approval', 'Approved'] }
    })
      .populate({
        path: 'student',
        select: 'name surname gpa classYear departmentName email phone address'
      })
      .populate({
        path: 'announcement',
        populate: {
          path: 'company',
          select: 'companyName sector location contactNumber employeeNum'
        },
        select: 'internshipName internshipType internshipProgram insuranceSituation dateRange1 dateRange2 departmentNames studentDepartmentNames'
      })
      .exec();

    const formattedApplications = applications.map(application => {
      return {
        id: application._id,
        name: application.student.name,
        surname: application.student.surname,
        status: application.status,
        gpa: application.student.gpa,
        classYear: application.student.classYear,
        departmentName: application.student.departmentName,
        email: application.student.email,
        phone: application.student.phone,
        address: application.student.address,
        companyName: application.announcement.company.companyName,
        sector: application.announcement.company.sector,
        location: application.announcement.company.location,
        employeeNum: application.announcement.company.employeeNum,
        contactNumber: application.announcement.company.contactNumber,
        internshipName: application.announcement.internshipName,
        internshipType: application.announcement.internshipType,
        internshipProgram: application.announcement.internshipProgram,
        insuranceSituation: application.announcement.insuranceSituation,
        dateRange1: application.announcement.dateRange1,
        dateRange2: application.announcement.dateRange2,
        departmentNames: application.announcement.departmentNames,
        studentDepartmentNames: application.announcement.studentDepartmentNames
      };
    });

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Error retrieving pending applications:', error);
    res.status(500).json({ error: 'Failed to retrieve pending applications' });
  }
};







 const getInternshipsBySupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.supervisorId;

    // Find the supervisor by ID
    const supervisor = await Supervisor.findById(supervisorId);

    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Get the department name
    const departmentName = supervisor.departmentName;

    // Find internships with matching department name
    const internships = await Internship.find()
      .populate({
        path: 'student',
        select: 'name surname',
        match: { departmentName: departmentName },
      })
      .populate({
        path: 'company',
        select: 'companyName',
      })
      .select("startDate endDate internshipBook evaluationForm status internshipBookStatus")
      .lean();

    // Filter out internships where student's departmentName doesn't match
    const filteredInternships = internships.filter(
      (internship) => internship.student !== null
    );

    const responseData = filteredInternships.map((internship) => ({
  key: internship._id, 
  name: `${internship.student.name} ${internship.student.surname}`,
  companyName: internship.company.companyName,
  startDate: internship.startDate,
  endDate: internship.endDate,
  status: internship.status,
  internshipBookStatus: internship.internshipBookStatus, 
  internshipBook: internship.internshipBook, 
  evaluationForm: internship.evaluationForm, 
}));


    return res.json({ internships: responseData });
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
