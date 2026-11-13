import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "flood-reports"
);

// Crear la carpeta si todavía no existe.
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${randomUUID()}${extension}`);
    }
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de imagen no permitido"));
    }
};

export const uploadFloodReportImages = multer({storage, fileFilter, limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB máximo
        files: 5
    }
}).array("fotografias", 5);