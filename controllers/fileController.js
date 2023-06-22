const Internship = require("../models/internship");


// Handle the file upload for Internship Book
const uploadInternshipBook = async (internshipId, file) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      throw new Error('Internship not found');
    }

    // Update the Internship Book fields
    internship.internshipBook.data = file.buffer;
    internship.internshipBook.contentType = file.mimetype;
    internship.internshipBook.fileName = file.originalname;

    // Save the updated Internship model
    await internship.save();
  } catch (error) {
    console.error('Error uploading Internship Book:', error);
    throw new Error('Failed to upload Internship Book');
  }
};

// Handle the file download for Internship Book
const downloadInternshipBook = async (internshipId, res) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.internshipBook) {
      throw new Error('Internship or Internship Book not found');
    }
    console.log(internshipId);
    // Set the appropriate headers for the response
    res.set('Content-Type', internship.internshipBook.contentType);
    res.set('Content-Disposition', `attachment; filename="${internship.internshipBook.fileName}"`);

    // Send the file data as the response
    res.send(internship.internshipBook.data);
  } catch (error) {
    console.error('Error downloading Internship Book:', error);
    res.status(500).json({ error: 'Failed to download Internship Book' });
  }
};

const deleteInternshipBook = async (internshipId) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.internshipBook) {
      throw new Error('Internship or Internship Book not found');
    }

    // Clear the Internship Book fields
    internship.internshipBook.data = undefined;
    internship.internshipBook.contentType = undefined;
    internship.internshipBook.fileName = undefined;

    // Save the updated Internship model
    await internship.save();
  } catch (error) {
    console.error('Error deleting Internship Book:', error);
    throw new Error('Failed to delete Internship Book');
  }
};

// Handle the file upload for Evaluation Form
const uploadEvaluationForm = async (internshipId, file) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      throw new Error('Internship not found');
    }

    // Update the Evaluation Form fields
    internship.evaluationForm.data = file.buffer;
    internship.evaluationForm.contentType = file.mimetype;
    internship.evaluationForm.fileName = file.originalname;

    // Save the updated Internship model
    await internship.save();
  } catch (error) {
    console.error('Error uploading Evaluation Form:', error);
    throw new Error('Failed to upload Evaluation Form');
  }
};

// Handle the file download for Evaluation Form
const downloadEvaluationForm = async (internshipId, res) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.evaluationForm) {
      throw new Error('Internship or Evaluation Form not found');
    }

    // Set the appropriate headers for the response
    res.set('Content-Type', internship.evaluationForm.contentType);
    res.set('Content-Disposition', `attachment; filename="${internship.evaluationForm.fileName}"`);

    // Send the file data as the response
    res.send(internship.evaluationForm.data);
  } catch (error) {
    console.error('Error downloading Evaluation Form:', error);
    res.status(500).json({ error: 'Failed to download Evaluation Form' });
  }
};

// Delete the Evaluation Form
const deleteEvaluationForm = async (internshipId) => {
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.evaluationForm) {
      throw new Error('Internship or Evaluation Form not found');
    }

    // Clear the Evaluation Form fields
    internship.evaluationForm.data = undefined;
    internship.evaluationForm.contentType = undefined;
    internship.evaluationForm.fileName = undefined;

    // Save the updated Internship model
    await internship.save();
  } catch (error) {
    console.error('Error deleting Evaluation Form:', error);
    throw new Error('Failed to delete Evaluation Form');
  }
};

module.exports = {
  uploadInternshipBook,
  downloadInternshipBook,
  deleteInternshipBook,
  uploadEvaluationForm,
  downloadEvaluationForm,
  deleteEvaluationForm,
};