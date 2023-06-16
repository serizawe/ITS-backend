const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routers/login"); 
const companyRouter = require("./routers/companyRouter");
const internshipAnnouncementRouter = require("./routers/internshipAnnouncementRouter");
const internshipApplicationRouter = require("./routers/internshipApplicationRouter");
const internshipRouter = require("./routers/internshipsRouter");
const studentRouter = require("./routers/studentRouter");
const supervisorRouter = require("./routers/supervisorRouter");
const fileRouter = require("./routers/fileRouter");
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

app.use("/api/", authRouter);
app.use("/api/", companyRouter);
app.use("/api/", internshipAnnouncementRouter);
app.use("/api/", internshipApplicationRouter);
app.use("/api/", internshipRouter);
app.use("/api/", studentRouter);
app.use("/api/", supervisorRouter);
app.use("/api/", supervisorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
