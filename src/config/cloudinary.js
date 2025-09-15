import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // p.ej. "dxxxxx"
    api_key:    process.env.CLOUDINARY_API_KEY,     // p.ej. "1234567890"
    api_secret: process.env.CLOUDINARY_API_SECRET,  // p.ej. "abcd1234"
    secure: true,
});

export default cloudinary;
