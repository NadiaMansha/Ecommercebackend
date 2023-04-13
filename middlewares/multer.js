const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up the storage engine for uploaded images
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware to handle file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Max file size of 1 MB
  fileFilter: (req, file, callback) => {
    // Check file type to allow only images
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      callback(null, true);
    } else {
      callback('Error: Only image files are allowed!');
    }
  }
}).array('images', 5); // Allow up to 5 images per event

module.exports = upload;

