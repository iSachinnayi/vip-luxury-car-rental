// ═══════════════════════════════════════════════
//  GET /admin/api/pages — All pages for admin panel
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getAllBrands, getAllTypes } from "@/lib/cars";
import { getAllContentSlugs } from "@/lib/content";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const allBrands = getAllBrands();
    const allTypes = getAllTypes();
    const contentSlugs = getAllContentSlugs();

    const staticPages = [
      { slug: "home", title: "Home Page", type: "static", editUrl: "/", hasContent: contentSlugs.includes("home") },
      { slug: "all-cars", title: "All Cars", type: "static", editUrl: "/all-cars/", hasContent: contentSlugs.includes("all-cars") },
      { slug: "brand", title: "Brands Listing", type: "static", editUrl: "/brand/", hasContent: true },
      { slug: "about", title: "About Us", type: "static", editUrl: "/about/", hasContent: contentSlugs.includes("about") },
      { slug: "contact", title: "Contact", type: "static", editUrl: "/contact/", hasContent: contentSlugs.includes("contact") },
      { slug: "faq", title: "FAQ", type: "static", editUrl: "/faq/", hasContent: contentSlugs.includes("faq") },
      { slug: "privacy", title: "Privacy Policy", type: "static", editUrl: "/privacy/", hasContent: true },
      { slug: "terms", title: "Terms & Conditions", type: "static", editUrl: "/terms/", hasContent: true },
    ];

    const brandPages = allBrands.map((b: string) => ({
      slug: b.toLowerCase().replace(/\s+/g, "-"),
      title: b,
      type: "brand",
      editUrl: `/${b.toLowerCase().replace(/\s+/g, "-")}/`,
      hasContent: contentSlugs.includes(b.toLowerCase().replace(/\s+/g, "-")),
    }));

    const categoryPages = allTypes.map((t: string) => ({
      slug: t.toLowerCase().replace(/\s+/g, "-"),
      title: t,
      type: "category",
      editUrl: `/${t.toLowerCase().replace(/\s+/g, "-")}/`,
      hasContent: contentSlugs.includes(t.toLowerCase().replace(/\s+/g, "-")),
    }));

    return NextResponse.json({
      pages: [...staticPages, ...brandPages, ...categoryPages],
      total: staticPages.length + brandPages.length + categoryPages.length,
    });
  } catch (err) {
    console.error("Failed to fetch pages for admin:", err);
    return NextResponse.json({ pages: [], total: 0 }, { status: 500 });
  }
}
