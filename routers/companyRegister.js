const express = require('express');
const router = express.Router();
const companyController = require('../controllers/CompanyController');


// Create a new company
router.post('/', companyController.createCompany);

// Retrieve all companies
router.get('/companies', companyController.getAllCompanies);

// Retrieve a single company by id
router.get('/companies/:id', companyController.getCompanyById);

// Update a company by id
router.put('/companies/:id', companyController.updateCompanyById);

// Delete a company by id
router.delete('/companies/:id', companyController.deleteCompanyById);

module.exports = router;
