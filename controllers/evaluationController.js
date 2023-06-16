// Import required modules
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI for the cloud-hosted database
const uri = 'mongodb+srv://seriz:sE2eJF3XKoAdz4Mh@its.yyugrmm.mongodb.net/test';

// Create a MongoDB connection
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the MongoDB server
mongoClient.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  // Access the database and GridFS bucket
  const db = mongoClient.db('ITS');
  const bucket = new GridFSBucket(db);

  // Handle the file upload using GridFS
  const uploadEvaluationForm = (internshipId, file) => {
    return new Promise((resolve, reject) => {
      // Create a writable stream to GridFS
      const uploadStream = bucket.openUploadStream(`${internshipId}-evaluation.pdf`);

      // Pipe the evaluation file data to the GridFS stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);

      uploadStream.on('error', (error) => {
        console.error('Error uploading evaluation form:', error);
        reject(new Error('Failed to upload evaluation form'));
      });

      uploadStream.on('finish', () => {
        resolve();
      });
    });
  };

  // Handle the file download using GridFS
  const downloadEvaluationForm = (internshipId, res) => {
    // Create a readable stream from GridFS
    const downloadStream = bucket.openDownloadStreamByName(`${internshipId}-evaluation.pdf`);

    // Set the appropriate headers for the response
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="evaluation.pdf"');

    // Pipe the file data from GridFS to the response stream
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Error downloading evaluation form:', error);
      res.status(500).json({ error: 'Failed to download evaluation form' });
    });
  };

  // Handle the file upload for Internship Book using GridFS
  const uploadInternshipBook = (internshipId, file) => {
    return new Promise((resolve, reject) => {
      // Create a writable stream to GridFS
      const uploadStream = bucket.openUploadStream(`${internshipId}-internshipbook.pdf`);

      // Pipe the Internship Book file data to the GridFS stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);

      uploadStream.on('error', (error) => {
        console.error('Error uploading Internship Book:', error);
        reject(new Error('Failed to upload Internship Book'));
      });

      uploadStream.on('finish', () => {
        resolve();
      });
    });
  };

  // Handle the file download for Internship Book using GridFS
  const downloadInternshipBook = (internshipId, res) => {
    // Create a readable stream from GridFS
    const downloadStream = bucket.openDownloadStreamByName(`${internshipId}-internshipbook.pdf`);

    // Set the appropriate headers for the response
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="internshipbook.pdf"');

    // Pipe the file data from GridFS to the response stream
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Error downloading Internship Book:', error);
      res.status(500).json({ error: 'Failed to download Internship Book' });
    });

    downloadStream.on('end', () => {
      res.end();
    });
  };

  const deleteInternshipBook = (internshipId) => {
    return new Promise((resolve, reject) => {
      // Delete the internship book from GridFS
      bucket.delete(`${internshipId}-internshipbook.pdf`, (error) => {
        if (error) {
          console.error('Error deleting Internship Book:', error);
          reject(new Error('Failed to delete Internship Book'));
        } else {
          resolve();
        }
      });
    });
  };

  const deleteEvaluationForm = (internshipId) => {
    return new Promise((resolve, reject) => {
      // Delete the evaluation form from GridFS
      bucket.delete(`${internshipId}-evaluation.pdf`, (error) => {
        if (error) {
          console.error('Error deleting Evaluation Form:', error);
          reject(new Error('Failed to delete Evaluation Form'));
        } else {
          resolve();
        }
      });
    });
  };

  module.exports = {
    uploadInternshipBook,
    downloadInternshipBook,
    uploadEvaluationForm,
    downloadEvaluationForm,
    deleteInternshipBook,
    deleteEvaluationForm,
  };
});

