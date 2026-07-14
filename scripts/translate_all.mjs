// ═════════════════════════════════════════════════
//  DeepL Auto-Translation Script
//  Run: node scripts/translate_all.mjs
//  Translates: messages/, car data, emirates, static pages
//  Zero manual work — fully automated
// ═════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Config ────────────────────────────────────────

const DEEPL_API_KEY = "128e8f31-3974-4e13-a405-67e2548b212b:fx";
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

const TARGET_LANGS = ["AR", "RU"];
const SOURCE_LANG = "EN";

const BATCH_SIZE = 10; // DeepL max texts per request
const RATE_LIMIT_MS = 200; // 5 requests/sec free tier

// ─── Helpers ────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translate(texts, targetLang) {
  if (!texts || texts.length === 0) return [];
  
  const results = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    const formData = new URLSearchParams();
    formData.set("source_lang", SOURCE_LANG);
    formData.set("target_lang", targetLang);
    batch.forEach((t) => formData.append("text", t));
    
    try {
      const res = await fetch(DEEPL_URL, {
        method: "POST",
        headers: {
          "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error(`  DeepL error (${res.status}): ${errText}`);
        // Return original texts on error
        results.push(...batch);
        continue;
      }
      
      const data = await res.json();
      results.push(...data.translations.map((t) => t.text));
    } catch (err) {
      console.error(`  Network error: ${err.message}`);
      results.push(...batch);
    }
    
    // Rate limiting
    if (i + BATCH_SIZE < texts.length) await sleep(RATE_LIMIT_MS);
  }
  
  return results;
}

// ─── Flatten / Unflatten JSON ──────────────────────

function flatten(obj, prefix = "", sep = ".") {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const k = prefix ? `${prefix}${sep}${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flatten(val, k, sep));
    } else {
      result[k] = String(val);
    }
  }
  return result;
}

function unflatten(obj, sep = ".") {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const parts = key.split(sep);
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = val;
  }
  return result;
}

// ─── 1. Translate messages/{lang}.json ─────────────

async function translateMessages() {
  console.log("\n=== 1. Translating messages/*.json ===");
  
  const sourcePath = resolve(ROOT, "messages", "en.json");
  const source = JSON.parse(readFileSync(sourcePath, "utf-8"));
  const flat = flatten(source);
  const keys = Object.keys(flat);
  const values = Object.values(flat);
  
  console.log(`  Source: ${keys.length} translation keys`);
  
  for (const lang of TARGET_LANGS) {
    const langLower = lang.toLowerCase();
    console.log(`  → Translating to ${lang}...`);
    
    const translated = await translate(values, lang);
    const newFlat = {};
    keys.forEach((k, i) => { newFlat[k] = translated[i]; });
    
    const outputPath = resolve(ROOT, "messages", `${langLower}.json`);
    writeFileSync(outputPath, JSON.stringify(unflatten(newFlat), null, 2) + "\n");
    console.log(`  ✓ Saved messages/${langLower}.json`);
  }
}

// ─── 2. Translate Car Data ─────────────────────────

async function translateCarData() {
  console.log("\n=== 2. Translating car data ===");
  
  const carsPath = resolve(ROOT, "..", "server_data", "structured_data", "all_cars.json");
  if (!existsSync(carsPath)) {
    console.log("  ⚠ all_cars.json not found, checking alternative paths...");
    const alt = resolve(ROOT, "server_data", "structured_data", "all_cars.json");
    if (existsSync(alt)) {
      carsPath = alt;
    } else {
      console.log("  ✗ Cannot find all_cars.json. Skipping car data translation.");
      return;
    }
  }
  
  const cars = JSON.parse(readFileSync(carsPath, "utf-8"));
  const translationsDir = resolve(ROOT, "src", "data", "translations");
  if (!existsSync(translationsDir)) mkdirSync(translationsDir, { recursive: true });
  
  for (const lang of TARGET_LANGS) {
    const langLower = lang.toLowerCase();
    console.log(`  → Translating ${cars.length} cars to ${lang}...`);
    
    const translatedCars = [];
    
    // Process in chunks to show progress
    const CHUNK = 5;
    for (let i = 0; i < cars.length; i += CHUNK) {
      const chunk = cars.slice(i, i + CHUNK);
      
      const batch = [];
      const indices = [];
      
      chunk.forEach((car, idx) => {
        const items = [];
        // Translate all text fields including titles
        if (car.title && car.title.length > 2) {
          items.push({ type: "title", text: car.title, carIdx: i + idx });
        }
        if (car.excerpt && car.excerpt.length > 10) {
          items.push({ type: "excerpt", text: car.excerpt, carIdx: i + idx });
        }
        if (car.description_short && car.description_short.length > 10) {
          items.push({ type: "description_short", text: car.description_short, carIdx: i + idx });
        }
        if (car.description_full && car.description_full.length > 10) {
          items.push({ type: "description_full", text: car.description_full, carIdx: i + idx });
        }
        batch.push(...items);
      });
      
      if (batch.length > 0) {
        const texts = batch.map((b) => b.text);
        const translatedTexts = await translate(texts, lang);
        
        batch.forEach((b, j) => {
          const idx = b.carIdx;
          if (!translatedCars[idx]) translatedCars[idx] = { slug: cars[idx].slug, title: cars[idx].title };
          translatedCars[idx][b.type] = translatedTexts[j];
        });
      } else {
        chunk.forEach((car, idx) => {
          const carIdx = i + idx;
          if (!translatedCars[carIdx]) translatedCars[carIdx] = { slug: car.slug, title: car.title };
        });
      }
      
      process.stdout.write(`    ${Math.min(i + CHUNK, cars.length)}/${cars.length} cars\r`);
      await sleep(RATE_LIMIT_MS);
    }
    
    const outputPath = resolve(translationsDir, `cars_${langLower}.json`);
    writeFileSync(outputPath, JSON.stringify(translatedCars.filter(Boolean), null, 2) + "\n");
    console.log(`\n  ✓ Saved translations/cars_${langLower}.json`);
  }
}

// ─── 3. Translate Static Pages ─────────────────────

const STATIC_PAGES = [
  { slug: "about", title: "About Us" },
  { slug: "faq", title: "Frequently Asked Questions" },
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "terms", title: "Terms & Conditions" },
];

const PAGE_SECTIONS = {
  about: {
    meta: "VIP Luxury Car Rental Dubai is the premier luxury car rental service in Dubai...",
    intro: "Welcome to VIP Luxury Car Rental Dubai, your premier destination for luxury car rental in Dubai...",
    story: "Founded with a vision to redefine luxury transportation, VIP Luxury Car Rental has grown...",
    mission: "Our mission is to provide an unparalleled luxury car rental experience...",
  },
  faq: {
    meta: "Frequently asked questions about luxury car rental in Dubai...",
    q1: "What documents do I need to rent a luxury car in Dubai?",
    a1: "For tourists: valid passport, visit visa, home country driving license, and International Driving Permit (IDP). For UAE residents: valid UAE driving license and Emirates ID.",
    q2: "What is the minimum age to rent a car?",
    a2: "The minimum age to rent a luxury car in Dubai is 25 years with a minimum of 3 years driving experience.",
    q3: "Is insurance included?",
    a3: "Yes, comprehensive insurance is included with all our rentals at no additional cost.",
    q4: "Do you offer delivery outside Dubai?",
    a4: "Yes, we offer free delivery across Dubai, Abu Dhabi, Sharjah, and other emirates.",
    q5: "What payment methods do you accept?",
    a5: "We accept credit/debit cards, bank transfers, and cryptocurrency (Bitcoin, Ethereum, USDT).",
  },
  privacy: {
    meta: "VIP Luxury Car Rental Dubai privacy policy...",
    content: "This Privacy Policy describes how VIP Luxury Car Rental collects, uses, and shares your personal information...",
  },
  terms: {
    meta: "VIP Luxury Car Rental Dubai terms and conditions...",
    content: "By booking a vehicle with VIP Luxury Car Rental, you agree to the following terms and conditions...",
  },
};

async function translateStaticPages() {
  console.log("\n=== 3. Translating static pages ===");
  
  const transDir = resolve(ROOT, "src", "data", "translations");
  if (!existsSync(transDir)) mkdirSync(transDir, { recursive: true });
  
  for (const lang of TARGET_LANGS) {
    const langLower = lang.toLowerCase();
    console.log(`  → Translating static pages to ${lang}...`);
    
    const pageTranslations = {};
    
    for (const page of STATIC_PAGES) {
      const sections = PAGE_SECTIONS[page.slug];
      if (!sections) continue;
      
      const entries = Object.entries(sections);
      const texts = entries.map(([, v]) => v);
      const translated = await translate(texts, lang);
      
      pageTranslations[page.slug] = {};
      entries.forEach(([key], i) => {
        pageTranslations[page.slug][key] = translated[i];
      });
      
      await sleep(RATE_LIMIT_MS);
    }
    
    const outputPath = resolve(transDir, `pages_${langLower}.json`);
    writeFileSync(outputPath, JSON.stringify(pageTranslations, null, 2) + "\n");
    console.log(`  ✓ Saved translations/pages_${langLower}.json`);
  }
}

// ─── 4. Translate Emirate Data ─────────────────────

async function translateEmirates() {
  console.log("\n=== 4. Translating emirate data ===");
  
  // Re-read emirates.ts to get the data
  // For now, we define emirate content inline (same as emirates.ts)
  const emirates = [
    {
      slug: "abu-dhabi",
      description: "Explore the capital of the UAE with VIP Luxury Car Rental. From the stunning Sheikh Zayed Grand Mosque to the thrilling Ferrari World and the cultural district of Saadiyat Island, Abu Dhabi offers an unmatched blend of luxury, culture, and adventure. Our premium fleet ensures you travel between these iconic landmarks in style and comfort.",
      intro: "Whether you are visiting for business, a family holiday, or a special occasion, renting a luxury car in Abu Dhabi elevates your experience. Our fleet of 350+ premium vehicles includes sports cars, SUVs, and luxury sedans — all available with free delivery to your hotel, villa, or airport terminal across Abu Dhabi.",
      deliveryNote: "We deliver and pick up vehicles anywhere in Abu Dhabi city, Yas Island, Saadiyat Island, Al Ain, and all Abu Dhabi airports. Our drivers coordinate directly with you for a seamless handover.",
      metaDesc: "Rent luxury cars in Abu Dhabi with VIP Luxury Car Rental. Premium sports cars, SUVs & sedans with free delivery across Abu Dhabi. Full insurance, no deposit options & 24/7 support. Book online today!",
      attractions: [
        "Sheikh Zayed Grand Mosque — One of the world's largest mosques, open to visitors",
        "Ferrari World Abu Dhabi — Thrilling rides on Yas Island",
        "Yas Marina Circuit — Home of the Formula 1 Abu Dhabi Grand Prix",
        "Saadiyat Island — Cultural district with Louvre Abu Dhabi",
        "Corniche Beach — 8 km of pristine coastline and promenade",
        "Qasr Al Watan — The Presidential Palace landmark",
        "Emirates Palace — Iconic luxury hotel and beach resort",
        "Al Ain — The Garden City, a UNESCO World Heritage site",
      ],
    },
    {
      slug: "sharjah",
      description: "Discover the cultural heart of the UAE with VIP Luxury Car Rental in Sharjah. As the UNESCO World Heritage-approved cultural capital, Sharjah blends rich heritage with modern attractions. From the historic Heart of Sharjah to the stunning Al Noor Mosque and the family-friendly Al Qasba waterfront, explore the emirate with the comfort of a premium vehicle.",
      intro: "Renting a luxury car in Sharjah gives you the freedom to explore its museums, souks, and beaches at your own pace. Our fleet of sports cars, luxury SUVs, and executive sedans is available with complimentary delivery to any location in Sharjah, including hotels, residences, and Sharjah International Airport.",
      deliveryNote: "Free delivery and pickup across Sharjah city, Al Majaz, Al Qasba, university area, and Sharjah International Airport. Our team ensures a smooth handover at your preferred location.",
      metaDesc: "Premium luxury car rental in Sharjah. Rent sports cars, SUVs & executive sedans with free delivery across Sharjah. Full insurance, competitive rates & 24/7 roadside assistance. Book your dream car today!",
      attractions: [
        "Heart of Sharjah — Heritage district with restored traditional architecture",
        "Al Noor Mosque — Stunning Ottoman-inspired architecture on the Khalid Lagoon",
        "Al Qasba — Waterfront dining, entertainment, and the iconic Eye of the Emirates wheel",
        "Sharjah Art Museum — One of the largest art museums in the Gulf",
        "Al Majaz Waterfront — Family destination with fountains and restaurants",
        "Mleiha Archaeological Centre — Ancient tombs and desert adventures",
        "Sharjah Aquarium — Marine life exhibits along the Corniche",
      ],
    },
    {
      slug: "ras-al-khaimah",
      description: "Experience the natural beauty of Ras Al Khaimah with VIP Luxury Car Rental. From the majestic Jebel Jais mountain range to pristine beaches and world-class resorts, RAK is the UAE's fastest-growing tourism destination. A luxury car is the perfect way to explore everything this stunning emirate has to offer.",
      intro: "Ras Al Khaimah offers a perfect blend of adventure and relaxation. Renting a premium vehicle from our fleet lets you cruise along the coastal roads, drive up to Jebel Jais — the UAE's highest peak — and arrive at luxury resorts in style. We offer free delivery across RAK including all hotels, resorts, and airports.",
      deliveryNote: "Complimentary delivery and pickup throughout Ras Al Khaimah including Al Marjan Island, Al Hamra Village, RAK City, and all resort hotels. We also deliver to Ras Al Khaimah International Airport.",
      metaDesc: "Rent luxury cars in Ras Al Khaimah with VIP Luxury Car Rental. Sports cars, SUVs & premium sedans delivered free to your RAK hotel or resort. Full insurance & 24/7 support. Book your getaway car now!",
      attractions: [
        "Jebel Jais — UAE's highest mountain with the world's longest zipline",
        "Al Marjan Island — Man-made islands with beachfront resorts",
        "RAK Mall — Premier shopping and dining destination",
        "Dhayah Fort — Historic hilltop fort with panoramic views",
        "Saqr Park — Family-friendly green spaces and picnic areas",
        "Ras Al Khaimah National Museum — History and archaeology exhibits",
      ],
    },
  ];
  
  const localeDir = resolve(ROOT, "src", "data", "translations");
  if (!existsSync(localeDir)) mkdirSync(localeDir, { recursive: true });
  
  for (const lang of TARGET_LANGS) {
    const langLower = lang.toLowerCase();
    console.log(`  → Translating emirate data to ${lang}...`);
    
    const translated = [];
    
    for (const emirate of emirates) {
      // Translate main fields
      const texts = [emirate.description, emirate.intro, emirate.deliveryNote, emirate.metaDesc, ...emirate.attractions];
      const translatedTexts = await translate(texts, lang);
      
      translated.push({
        slug: emirate.slug,
        name: emirate.slug === "ras-al-khaimah" ? (lang === "AR" ? "رأس الخيمة" : "Рас-эль-Хайма") : undefined,
        description: translatedTexts[0],
        intro: translatedTexts[1],
        deliveryNote: translatedTexts[2],
        metaDesc: translatedTexts[3],
        attractions: translatedTexts.slice(4),
      });
      
      await sleep(RATE_LIMIT_MS);
    }
    
    const outputPath = resolve(localeDir, `emirates_${langLower}.json`);
    writeFileSync(outputPath, JSON.stringify(translated, null, 2) + "\n");
    console.log(`  ✓ Saved translations/emirates_${langLower}.json`);
  }
}

// ─── Main ───────────────────────────────────────────

async function main() {
  console.log("╔═══════════════════════════════════════════╗");
  console.log("║   DeepL Auto-Translation Script          ║");
  console.log("║   EN → AR, RU                            ║");
  console.log("╚═══════════════════════════════════════════╝");
  console.log(`  API Key: ${DEEPL_API_KEY.substring(0, 10)}...`);
  console.log(`  Target: ${TARGET_LANGS.join(", ")}`);
  
  const start = Date.now();
  
  await translateMessages();
  await translateCarData();
  await translateStaticPages();
  await translateEmirates();
  
  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
  console.log(`\n✅ All translations complete in ${elapsed} minutes!`);
  console.log("   Files generated in:");
  console.log("   - messages/{ar,ru}.json");
  console.log("   - src/data/translations/cars_{ar,ru}.json");
  console.log("   - src/data/translations/pages_{ar,ru}.json");
  console.log("   - src/data/translations/emirates_{ar,ru}.json");
}

main().catch(console.error);
