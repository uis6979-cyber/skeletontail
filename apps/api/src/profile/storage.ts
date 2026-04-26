import { diskStorage } from "multer";
import { extname } from "path";

/**
 * Configures disk storage for user avatars.
 * Uses a unique suffix to prevent filename collisions.
 */
export const avatarStorage = diskStorage({
  destination: "./public/uploads/avatars",
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname);

    callback(null, `avatar-${uniqueSuffix}${ext}`);
  },
});
