const Student = require('../models/student');
const InternshipApplication = require('../models/internshipApplication');


// Create a new student
const createStudent = async (req, res) => {
  try {
    const { studentNumber, name, surname, classYear, gpa, email, phone, address, password, department } = req.body;
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
      department,
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
const Internship = require('../models/internship');

// Get internship details for a student
const getInternshipDetails = async (req, res) => {
  try {
    const { studentId, internshipId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the internship
    const internship = await Internship.findOne({ _id: internshipId, student: studentId })
      .populate('company', 'companyName sector location')
      .populate('supervisor', 'name surname');

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Create a modified version of the internship data without the evaluation field
    const internshipData = {
      student: internship.student,
      company: internship.company,
      startDate: internship.startDate,
      endDate: internship.endDate,
      supervisor: internship.supervisor,
      internshipBook: internship.internshipBook,
      status: internship.status
    };

    res.status(200).json({ data: internshipData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInternshipDetails
};




module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createInternshipApplication,
  deleteInternshipApplication,
  getInternshipDetails
};
