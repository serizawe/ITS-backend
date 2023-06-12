const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;