import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "uploads");

// Ensure target folders exist so multer never fails on a missing directory
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(uploadsRoot, "products"));
ensureDir(path.join(uploadsRoot, "profile"));

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const makeStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadsRoot, subfolder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Only JPEG, PNG, or WEBP images are allowed"),
      false
    );
  }
  cb(null, true);
};

export const uploadProductImage = multer({
  storage: makeStorage("products"),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single("image");

export const uploadProfileImage = multer({
  storage: makeStorage("profile"),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single("profileImage");

// Wraps a multer middleware so upload errors (wrong type, too large) come
// back as clean JSON instead of crashing the request.
export const handleUpload = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      let message = "Image upload failed";
      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Image must be smaller than 5MB";
      }
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Public URL builder so controllers/frontend agree on how image paths look
export const toPublicPath = (subfolder, filename) =>
  `/uploads/${subfolder}/${filename}`;
