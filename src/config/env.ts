import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  OCR_API_KEY: process.env.OCR_API_KEY,
  OCR_API_URL: process.env.OCR_API_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

export default env;
