import multer from "multer";

const storage = multer.memoryStorage(); // buffer en memoria -> ideal para stream a Cloudinary
export const upload = multer({ storage });

export const uploadSingleImage = upload.single("image");
