const Student = require('../models/student');
const InternshipApplication = require('../models/internshipApplication');
const bcrypt = require('bcrypt');
const Internship = require('../models/internship');

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { studentNumber, name, surname, classYear, gpa, email, phone, address, password, departmentName } = req.body;
    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = new Student({
      studentNumber,
      name,
      surname,
      classYear,
      gpa,
      email,
      phone,
      address,
      password,
      departmentName,
      internshipExperiences: [],
      internshipApplications: []
    });
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function for changing the password
const changePassword = async (req, res) => {
  const { studentId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const student = await Student.findById(studentId);

    // Verify if the current password matches the stored password using bcrypt
    const passwordMatch = await bcrypt.compare(currentPassword, student.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update the password
    student.password = newPassword;

    // Save the updated user
    await student.save();

    // Return success response
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};


// Update a student
const updateStudent = async (req, res) => {
  try {
    const { studentNumber, name, surname, classYear, gpa, email, phone, address, password, department } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentNumber,
        name,
        surname,
        classYear,
        gpa,
        email,
        phone,
        address,
        password,
        department
      },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndRemove(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all internship announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await InternshipAnnouncement.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error getting internship announcements:', error);
    res.status(500).json({ error: 'An error occurred while fetching internship announcements' });
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


const getInternshipDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all internships for the student
    const internships = await Internship.find({ student: studentId })
      .populate('company', 'companyName');

    // Modify the internships data for frontend display
    const internshipData = internships.map((internship) => ({
      id: internship._id,
      company: {
        companyId: internship.company._id,
        companyName: internship.company.companyName,
      },
      startDate: internship.startDate,
      endDate: internship.endDate,
      internshipBook: internship.internshipBook,
      bookStatus:internship.internshipBookStatus,
      bookComment: internship.bookComment, 
      status: internship.status,
    }));

    res.status(200).json(internshipData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const getStudentApplications = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const applications = await InternshipApplication.find({ student: studentId })
      .populate('student', 'name')
      .populate({
        path: 'announcement',
        populate: {
          path: 'company',
          select: 'companyName'
        }
      })
      .select('status')
      .select('_id');

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error getting student applications:', error);
    res.status(500).json({ error: 'An error occurred while fetching student applications' });
  }
};






module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  changePassword,
  createInternshipApplication,
  deleteInternshipApplication,
  getInternshipDetails,
  getAllAnnouncements,
  getStudentApplications
};
