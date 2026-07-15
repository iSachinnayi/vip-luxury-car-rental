// ═══════════════════════════════════════════════
//  Image Service — Maps cars to real images
//  Fast: pre-built index, no filesystem scan
// ═══════════════════════════════════════════════

import fs from "fs";
import path from "path";
import { getUploadsDir, getStructuredDataDir } from "./image-path";

const UPLOADS_DIR = getUploadsDir();
const MAP_PATH = path.join(getStructuredDataDir(), "car_image_map.json");
const INDEX_PATH = path.join(getStructuredDataDir(), "available_images_index.json");

interface CarImageInfo { title: string; slug: string; thumbnail_url: string; gallery_urls: string[]; }

let imageMap: Record<string, CarImageInfo> | null = null;

function loadMap(): Record<string, CarImageInfo> {
  if (imageMap) return imageMap;
  try { if (fs.existsSync(MAP_PATH)) { imageMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8")); return imageMap!; } } catch (err) { console.error("Image map load error:", err); }
  return {};
}

/** Check if a remote WordPress URL's image file exists on local disk */
function checkFile(remoteUrl: string): string {
  const idx = remoteUrl.indexOf("/uploads/");
  if (idx === -1) return "";
  const rel = remoteUrl.substring(idx + 9);
  if (fs.existsSync(path.join(UPLOADS_DIR, rel.replace(/\//g, path.sep)))) return `/api/images/${rel}`;
  return "";
}

export function getCarImages(carId: number): { thumbnail: string; gallery: string[] } {
  const map = loadMap();
  const info = map[String(carId)];
  if (!info || !info.thumbnail_url) return { thumbnail: "", gallery: [] };

  const thumb = checkFile(info.thumbnail_url);
  const gallery = info.gallery_urls.map(checkFile).filter(Boolean) as string[];
  if (thumb) return { thumbnail: thumb, gallery };
  if (gallery.length > 0) return { thumbnail: gallery[0], gallery };
  return { thumbnail: "", gallery: [] };
}

export function getCarThumbnail(carId: number): string {
  return getCarImages(carId).thumbnail;
}
