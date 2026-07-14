// ═══════════════════════════════════════════════
//  SEOHead — Client-side SEO meta tag updater
//  Use in "use client" components
// ═══════════════════════════════════════════════

"use client";

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

export default function SEOHead({ title, description, ogImage, canonical }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", description || "");
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description || "");
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description || "");

    // OG Image
    const imgUrl = ogImage || "/api/images/2024/05/1-Rolls-Royce-Ghost-Black-Badge.webp";
    setMeta('meta[property="og:image"]', "property", "og:image", imgUrl);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", imgUrl);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, ogImage, canonical]);

  return null;
}
