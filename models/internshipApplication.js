const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internshipApplicationSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  announcement: { type: Schema.Types.ObjectId, ref: 'InternshipAnnouncement', required: true },
  status: { type: String, required: true, default: 'Pending' },
  internship: { type: Schema.Types.ObjectId, ref: 'Internship' },
});

const InternshipApplication = mongoose.model('InternshipApplication', internshipApplicationSchema);
module.exports = InternshipApplication;
