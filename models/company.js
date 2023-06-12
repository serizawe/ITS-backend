const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  sector: { type: String, required: true },
  location: { type: String },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  workAreas: [{ type: String }],
  internshipAnnouncements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InternshipAnnouncement' }],
  internshipApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InternshipApplication' }]
});

companySchema.pre('save', async function (next) {
  const company = this;
  if (!company.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(company.password, salt);
    company.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
