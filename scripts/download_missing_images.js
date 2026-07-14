// ═══════════════════════════════════════════════
//  download_missing_images.js
//  Downloads missing car images from old VIP site
//  Run: node download_missing_images.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ─── Paths ────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const IMG_MAP_PATH = path.join(PROJECT_ROOT, "server_data", "structured_data", "car_image_map.json");
const ALL_CARS_PATH = path.join(PROJECT_ROOT, "server_data", "structured_data", "all_cars.json");
const UPLOADS_DIR = path.join(
  PROJECT_ROOT, "server_data", "images_full",
  "var", "www", "vipluxurycarrental.com", "htdocs", "wp-content", "uploads"
);

// ─── Load data ────────────────────────────────
const imageMap = JSON.parse(fs.readFileSync(IMG_MAP_PATH, "utf-8"));
const allCars = JSON.parse(fs.readFileSync(ALL_CARS_PATH, "utf-8"));

// ─── Stats ────────────────────────────────────
let totalCars = 0;
let found = 0;
let missing = [];
let downloaded = 0;
let failed = [];

// ─── Check each car ──────────────────────────
console.log("\n=== Checking all cars for missing images ===\n");

allCars.forEach(car => {
  totalCars++;
  const entry = imageMap[String(car.id)];
  if (!entry || !entry.thumbnail_url) {
    missing.push({ car, reason: "No image map entry" });
    return;
  }

  const idx = entry.thumbnail_url.indexOf("/uploads/");
  if (idx === -1) {
    missing.push({ car, reason: "No /uploads/ in URL" });
    return;
  }

  const rel = entry.thumbnail_url.substring(idx + 9);
  const fullPath = path.join(UPLOADS_DIR, rel.replace(/\//g, path.sep));

  if (fs.existsSync(fullPath)) {
    found++;
  } else {
    missing.push({
      car,
      thumbnailUrl: entry.thumbnail_url,
      galleryUrls: entry.gallery_urls || [],
      relPath: rel
    });
  }
});

console.log(`Total cars: ${totalCars}`);
console.log(`With images: ${found}`);
console.log(`Missing images: ${missing.length}`);
console.log(`Missing cars: ${missing.length}\n`);

// ─── Download function ───────────────────────
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      resolve(false); // false = already existed
      return;
    }

    const protocol = url.startsWith("https") ? https : http;

    protocol.get(url, { timeout: 30000 }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(true); // true = downloaded
      });
    }).on("error", reject).on("timeout", function() {
      this.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

// ─── Download all missing images ─────────────
async function downloadAll() {
  console.log("\n=== Downloading missing images from old VIP site ===\n");

  for (const item of missing) {
    const { car, thumbnailUrl, galleryUrls, relPath } = item;
    const destPath = path.join(UPLOADS_DIR, relPath.replace(/\//g, path.sep));

    console.log(`\n[${car.id}] ${car.title} (${car.slug})`);
    console.log(`  → ${relPath}`);

    try {
      const result = await downloadFile(thumbnailUrl, destPath);
      if (result) {
        downloaded++;
        console.log(`  ✅ Thumbnail downloaded`);
      } else {
        console.log(`  ⏭️  Thumbnail already exists`);
      }
    } catch (err) {
      failed.push({ car, url: thumbnailUrl, error: err.message });
      console.log(`  ❌ Thumbnail failed: ${err.message}`);
    }

    // Download gallery images
    for (let i = 0; i < galleryUrls.length; i++) {
      const galleryUrl = galleryUrls[i];
      const gIdx = galleryUrl.indexOf("/uploads/");
      if (gIdx === -1) continue;
      const gRel = galleryUrl.substring(gIdx + 9);
      const gDest = path.join(UPLOADS_DIR, gRel.replace(/\//g, path.sep));

      try {
        const result = await downloadFile(galleryUrl, gDest);
        if (result) {
          downloaded++;
          process.stdout.write(`  ✅ Gallery ${i + 1}/${galleryUrls.length}\r`);
        }
      } catch (err) {
        console.log(`  ⚠️  Gallery ${i + 1} failed: ${err.message}`);
      }
    }
    console.log(`  📸 Gallery: ${galleryUrls.length} images processed`);
  }

  // ─── Summary ──────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("  DOWNLOAD SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Total missing cars:  ${missing.length}`);
  console.log(`  Files downloaded:    ${downloaded}`);
  console.log(`  Failed downloads:    ${failed.length}`);
  if (failed.length > 0) {
    console.log("\n  Failed downloads:");
    failed.forEach(f => console.log(`    ❌ [${f.car.id}] ${f.car.title}: ${f.error}`));
  }
  console.log("=".repeat(60));

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalCars,
    found,
    missing: missing.length,
    downloaded,
    failed: failed.length,
    failedDetails: failed,
    missingCars: missing.map(m => ({
      id: m.car.id,
      title: m.car.title,
      slug: m.car.slug,
      thumbnail: m.relPath
    }))
  };
  fs.writeFileSync(
    path.join(PROJECT_ROOT, "server_data", "image_download_report.json"),
    JSON.stringify(report, null, 2)
  );
  console.log("\n  Report saved to: server_data/image_download_report.json");
}

downloadAll().catch(console.error);
