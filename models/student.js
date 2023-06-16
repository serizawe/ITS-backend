const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  classYear: { type: Number, required: true },
  gpa: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  departmentName: { type: String, required: true }, 
  internshipExperiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }],
  internshipApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InternshipApplication' }]
});
studentSchema.pre('save', async function (next) {
  const student = this;
  if (!student.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(student.password, salt);
    student.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
