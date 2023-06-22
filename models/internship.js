const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  internshipBookStatus: { type: String, default: "Pending" },
  evaluationForm: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  internshipBook: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  status: { type: String, default: "Pending" },
  bookComment: { type: String },

});

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship