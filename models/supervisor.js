const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const internshipSupervisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  departmentName: { type: String, required: true }, // New departmentName field
});
internshipSupervisorSchema.pre('save', async function (next) {
  const supervisor = this;
  if (!supervisor.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(supervisor.password, salt);
    supervisor.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

const Supervisor = mongoose.model('Supervisor', internshipSupervisorSchema);

module.exports = Supervisor;
