import multer from "multer";
import path from "path";
import { Request } from "express";

// Define types for Multer's callback functions
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Use Multer's built-in FileFilterCallback type for the file filter
type FileFilterCallback = multer.FileFilterCallback;

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (
    _: Request, // Use underscore to indicate unused parameter
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (
    _: Request, // Use underscore to indicate unused parameter
    file: Express.Multer.File,
    cb: FileNameCallback
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File filter to allow only images
const fileFilter = (
  _: Request, // Use underscore to indicate unused parameter
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images are allowed!")); // Reject the file
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;