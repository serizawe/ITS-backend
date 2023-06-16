const express = require('express');
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  changePassword,
  deleteCompanyById,
  getInternshipsForCompany
} = require('../controllers/CompanyController');

// Create a new company
router.post('/companies', createCompany);

// Get all companies
router.get('/companies', getAllCompanies);

// Get a single company by ID
router.get('/companies/:id', getCompanyById);

// Update a company by ID
router.put('/companies/:id', updateCompanyById);

// Change company password
router.patch('/companies/:companyId/change-password', changePassword);

// Delete a company by ID
router.delete('/companies/:id', deleteCompanyById);

router.get('/companies/:companyId/internships',getInternshipsForCompany)

module.exports = router;
