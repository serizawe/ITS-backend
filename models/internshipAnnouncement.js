const mongoose = require('mongoose');

const internshipAnnouncementSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InternshipApplication' }],
  internshipName: { type: String, required: true },
  internshipType: { type: String, required: true }, 
  internshipProgram: { type: String, required: true }, 
  insuranceSituation: { type: String, required: true }, 
  dateRange1: { type: Date, required: true }, 
  dateRange2: { type: Date, required: true }, 
  departmentNames: { type: String, required: true }, 
  studentDepartmentNames: { type: String }, 
});

const InternshipAnnouncement = mongoose.model('InternshipAnnouncement', internshipAnnouncementSchema);
module.exports = InternshipAnnouncement;

