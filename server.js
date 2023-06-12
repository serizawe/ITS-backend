const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const login = require ("./routers/login");
const companyRegister = require("./routers/companyRegister")
const internshipAnnouncementRouter = require("./routers/internshipAnnouncementRouter")
const internshipApplicationRouter = require("./routers/internshipApplicationRouter")
const internshipsRouter = require("./routers/companyRegister")
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
});


app.use('/api', internshipApplicationRouter);
app.use('/api', internshipAnnouncementRouter);
app.use('/api', internshipsRouter);
app.use("/api/register" ,companyRegister)
app.use("/api" ,login)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});