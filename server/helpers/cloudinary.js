import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dhjcnbkdy",
  api_key: "714179119333759",
  api_secret: "DtimavFsPKZLg7MWoKHkuCnyB-E",
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const imageUploadUtil = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, 
      (error, result) => {
        if (error) {
          reject(error); 
        } else {
          resolve(result); 
        }
      }
    ).end(file.buffer); 
  });
};

export { upload };
