import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";

/**
 * Configures disk storage for user avatars.
 * Uploads are isolated by user ID and filenames are normalized.
 */
export const avatarStorage = diskStorage({
  destination: (req: any, _file, callback) => {
    const userId = req.user?.sub;

    if (!userId) {
      return callback(new Error("common.messages.error"), "");
    }

    const dir = join(process.cwd(), "public", "uploads", "avatars", userId);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    callback(null, dir);
  },

  filename: (_req, file, callback) => {
    let ext = extname(file.originalname).toLowerCase();

    // Standardize jpeg extension to jpg
    if (ext === ".jpeg") {
      ext = ".jpg";
    }

    if (!ext) {
      return callback(new Error("profile.messages.errors.invalidFileType"), "");
    }

    callback(null, `avatar${ext}`);
  },
});
