const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");
const Supervisor = require("../models/supervisor");
const Student = require("../models/student");
const crypto = require('crypto');

// Login route for company
router.post("/auth/login/company", async (req, res) => {
  const { email, password } = req.body;
  const secretKey = crypto.randomBytes(64).toString('hex');
  let user;
  let userType;
  user = await Company.findOne({ email });
  if (user) {
    userType = 'Company';
  } 
  // Check if user exists and password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    // Generate JWT token with user ID and userType as payload
    const token = jwt.sign({ userId: user._id, userType }, secretKey);

    // Return token to client
    res.json({ token, userId: user._id,userType });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Login route for supervisor
router.post("/auth/login/supervisor", async (req, res) => {
  const { email, password } = req.body;
  const secretKey = crypto.randomBytes(64).toString('hex');
  let user;
  let userType;
  user = await Supervisor.findOne({ email });
  if (user) {
    userType = 'Supervisor';
  } 
  // Check if user exists and password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    // Generate JWT token with user ID and userType as payload
    const token = jwt.sign({ userId: user._id, userType }, secretKey);

    // Return token to client
    res.json({ token, userId: user._id,userType });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Login route for student
router.post("/auth/login/student", async (req, res) => {
  const { email, password } = req.body;
  const secretKey = crypto.randomBytes(64).toString('hex');
  let user;
  let userType;
  user = await Student.findOne({ email });
  if (user) {
    userType = 'Student';
  } 
  // Check if user exists and password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    // Generate JWT token with user ID and userType as payload
    const token = jwt.sign({ userId: user._id, userType }, secretKey);

    // Return token to client
    res.json({ token, userId: user._id,userType });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});







// Logout route
router.post("/auth/logout", async (req, res) => {
  res.json({ message: "Logout successful" });
});



module.exports = router;
