// ═══════════════════════════════════════════════
//  Image Path — Single source of truth for
//  where car images are stored on disk
//  Uses IMAGES_UPLOADS_DIR env var in production
// ═══════════════════════════════════════════════

import path from "path";

/**
 * Returns the absolute path to the directory where uploaded images
 * are stored. In production, the path is configured via the
 * IMAGES_UPLOADS_DIR environment variable.
 *
 * The directory structure inside is:
 *   <UPLOADS_DIR>/<year>/<month>/<filename>
 * e.g. /var/data/images/uploads/2024/04/Urus-Black-With-Green-1.webp
 */
export function getUploadsDir(): string {
  // 1. Production / explicit override
  const env = process.env.IMAGES_UPLOADS_DIR;
  if (env) return env;

  // 2. Development — sibling server_data folder
  //    VIP Site AI Project/server_data/images_full/var/www/.../uploads/
  return path.join(
    process.cwd(),
    "..",
    "server_data",
    "images_full",
    "var",
    "www",
    "vipluxurycarrental.com",
    "htdocs",
    "wp-content",
    "uploads"
  );
}

/**
 * Returns the absolute path to the structured_data directory
 * containing car_image_map.json, all_cars.json, etc.
 */
export function getStructuredDataDir(): string {
  const env = process.env.STRUCTURED_DATA_DIR;
  if (env) return env;

  // Development — sibling server_data/structured_data/
  return path.join(process.cwd(), "..", "server_data", "structured_data");
}
