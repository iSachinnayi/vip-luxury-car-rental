// ═══════════════════════════════════════════════
//  Content Service — Loads writer's content
// ═══════════════════════════════════════════════

import fs from "fs";
import path from "path";

export interface PageContent {
  id: number;
  title: string;
  slug: string;
  type: string;
  content: {
    headings: { level: string; text: string }[];
    paragraphs: string[];
    images: { src: string; alt: string }[];
    cta_buttons: string[];
  };
}

let cachedContent: Record<string, PageContent> | null = null;

function loadAllContent(): Record<string, PageContent> {
  if (cachedContent) return cachedContent;

  const contentDir = path.join(process.cwd(), "..", "server_data", "structured_data", "pages_content");
  cachedContent = {};

  try {
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
        const page: PageContent = JSON.parse(raw);
        cachedContent[page.slug] = page;
      }
    }
  } catch (e) {
    console.error("Failed to load content:", e);
  }

  return cachedContent;
}

export function getPageContent(slug: string): PageContent | undefined {
  const all = loadAllContent();
  return all[slug];
}

export function getAllContentSlugs(): string[] {
  return Object.keys(loadAllContent());
}
