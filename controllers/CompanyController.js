const Company = require('../models/company');
const Internship = require('../models/internship');
const bcrypt = require('bcrypt');

// Controller for creating a company
const createCompany = async (req, res) => {
  try {
    const { firmname, sector, location, contact, employeeNum, email, password, workAreas } = req.body;

    // Check if a company with the given email already exists
    const existingCompany = await Company.findOne({ companyName: email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Create a new company instance
    const newCompany = new Company({
      companyName: firmname,
      sector,
      location,
      contactNumber: contact,
      password,
      email,
      workAreas,
      employeeNum
    });

    // Save the company to the database
    await newCompany.save();

    // Return a success response
    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting companies');
  }
};

// Get a single company by ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send('Company not found');
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting company');
  }
};

// Update a company by ID
const updateCompanyById = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!company) {
      return res.status(404).send('Company not found');
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating company');
  }
};

// Controller function for changing the password
const changePassword = async (req, res) => {
  const { companyId } = req.params;
  const { currentPassword, newPassword } = req.body;
  console.log(companyId);
  console.log(currentPassword,newPassword);
  try {
    // Find the user by ID
    const company = await Company.findById(companyId);

    // Verify if the current password matches the stored password using bcrypt
    const passwordMatch = await bcrypt.compare(currentPassword, company.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }


    // Update the password
    company.password = newPassword;

    // Save the updated user
    await company.save();

    // Return success response
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Delete a company by ID
const deleteCompanyById = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send('Company not found');
    }
    res.send('Company deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting company');
  }
};

async function getInternshipsForCompany(req, res) {
  const companyId = req.params.companyId;

  try {
    const internships = await Internship.find({ company: companyId })
      .populate({
        path: "student",
        select: "name surname",
      })
      .select("student startDate endDate internshipBook evaluationForm status internshipBookStatus")
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    res.json(internships);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve internships for the company" });
  }
}




module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  changePassword,
  deleteCompanyById,
  getInternshipsForCompany
};
