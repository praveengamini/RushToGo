import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dhjcnbkdy",
  api_key: "714179119333759",
  api_secret: "DtimavFsPKZLg7MWoKHkuCnyB-E",
});

// Set up multer storage in memory for image upload
const storage = multer.memoryStorage();

// Upload middleware
const upload = multer({ storage });

// Utility function to upload image to Cloudinary
export const imageUploadUtil = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Automatically detects file type
      (error, result) => {
        if (error) {
          reject(error); // Reject the promise if there's an error
        } else {
          resolve(result); // Resolve the promise with Cloudinary result
        }
      }
    ).end(file.buffer); // Upload the file from memory buffer
  });
};

// Export the upload middleware for use in routes
export { upload };
