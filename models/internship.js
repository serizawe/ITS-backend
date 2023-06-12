const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipSupervisor' },
  evaluation: { type: String },
  internshipBook: { type: String },
  status: { type: String },
});

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship