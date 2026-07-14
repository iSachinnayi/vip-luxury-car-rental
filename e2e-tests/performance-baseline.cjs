// ═══════════════════════════════════════════════
//  Performance Baseline Script
//  Captures page metrics via Playwright
// ═══════════════════════════════════════════════

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const urls = [
    { path: "/", name: "Homepage (EN)" },
    { path: "/ar/", name: "Homepage (AR)" },
    { path: "/all-cars/", name: "All Cars (EN)" },
    { path: "/car/lamborghini-urus/", name: "Car Detail (EN)" },
    { path: "/rent-bentley-in-dubai/", name: "Brand Page (EN)" },
  ];

  for (const { path, name } of urls) {
    const page = await browser.newPage();
    const start = Date.now();
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
    const loadTime = Date.now() - start;

    const metrics = await page.evaluate(() => ({
      title: document.title,
      scripts: document.querySelectorAll("script").length,
      images: document.querySelectorAll("img").length,
      links: document.querySelectorAll("a").length,
      htmlLen: document.body?.innerHTML?.length || 0,
    }));

    results.push({ name, loadTime, ...metrics });
    console.log(`✅ ${name}: ${loadTime}ms, ${metrics.images} images, ${metrics.scripts} scripts`);
    await page.close();
  }

  console.log("\n=== SUMMARY ===");
  console.table(results);
  await browser.close();
})();
