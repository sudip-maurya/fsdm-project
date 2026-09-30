const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file from local path to Cloudinary.
 * Uses resource_type: 'raw' for PDFs and ZIP files to ensure they can be downloaded/viewed reliably.
 */
const uploadToCloudinary = async (filePath, folder = 'open_repository') => {
  if (!filePath) return null;
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    return filePath;
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'raw',
    use_filename: true,
    unique_filename: true,
  });
  return result.secure_url;
};

module.exports = { cloudinary, uploadToCloudinary };
