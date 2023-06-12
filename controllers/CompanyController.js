const Company = require('../models/company');

// Controller for creating a company
const createCompany = async (req, res) => {
  try {
    const { firmname, sector, location, contact, username, email, password, workAreas } = req.body;

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
      username,
      email,
      workAreas
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

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById
};
