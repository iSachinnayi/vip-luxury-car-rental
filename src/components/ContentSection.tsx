// ═══════════════════════════════════════════════
//  ContentSection — Renders writer's content
//  Fetches from /api/content/[slug]
// ═══════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PageContent {
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

interface Props {
  slug: string;
  className?: string;
  maxParagraphs?: number;
  showHeadings?: boolean;
  variant?: "full" | "compact" | "minimal";
}

export default function ContentSection({
  slug,
  className = "",
  maxParagraphs = 999,
  showHeadings = true,
  variant = "full",
}: Props) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return null;
  if (!content) return null;

  const { paragraphs, headings } = content.content;
  const displayParagraphs = paragraphs.slice(0, maxParagraphs);

  if (variant === "minimal") {
    return (
      <div className={`text-gray-300 leading-relaxed space-y-4 ${className}`}>
        {displayParagraphs.slice(0, 2).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${className}`}
    >
      {/* Headings */}
      {showHeadings &&
        headings.map((h, i) => {
          const HeadingTag = h.level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
          return (
            <HeadingTag
              key={i}
              className={`font-serif text-white mb-4 ${
                h.level === "h1"
                  ? "text-3xl md:text-4xl"
                  : h.level === "h2"
                  ? "text-2xl md:text-3xl"
                  : "text-xl"
              }`}
            >
              {h.text}
            </HeadingTag>
          );
        })}

      {/* Paragraphs */}
      <div className="text-gray-300 leading-relaxed space-y-4">
        {displayParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </motion.div>
  );
}
