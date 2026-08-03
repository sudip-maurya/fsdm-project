const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // files saved to server/uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'reportFile') {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Report must be a PDF file'));
    }
  }
  if (file.fieldname === 'sourceCodeFile') {
    if (file.mimetype !== 'application/zip' && file.mimetype !== 'application/x-zip-compressed') {
      return cb(new Error('Source code must be a ZIP file'));
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
});

module.exports = upload;