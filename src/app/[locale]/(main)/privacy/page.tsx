// ═══════════════════════════════════════════════
//  Privacy Policy — VIP Luxury Car Rental Dubai
//  Premium formatted with proper section hierarchy
// ═══════════════════════════════════════════════

import type { Metadata } from "next/types";
import { getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection, { LegalList, LegalDivider } from "@/components/legal/LegalSection";
import LegalContactCard from "@/components/legal/LegalContactCard";

export async function generateMetadata() {
  const t = await getTranslations("privacy");
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = [
    { id: "introduction", label: t("s1Label") },
    { id: "information-we-collect", label: t("s2Label") },
    { id: "how-we-use-your-information", label: t("s3Label") },
    { id: "log-files", label: t("s4Label") },
    { id: "cookies-and-web-beacons", label: t("s5Label") },
    { id: "your-data-protection-rights-gdpr", label: t("s6Label") },
    { id: "children-s-information", label: t("s7Label") },
    { id: "changes-to-this-privacy-policy", label: t("s8Label") },
    { id: "contact-us", label: t("s9Label") },
  ];

  const parseList = (key: string) => JSON.parse(t(key));
  return (
    <LegalPageLayout
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      sections={sections}
    >
      {/* ─── 1. Introduction ─── */}
      <LegalSection title={t("s1Title")} number={1}>
        <p>{t("s1p1")}</p>
        <p>{t("s1p2")}</p>
        <p>{t("s1p3")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 2. Information We Collect ─── */}
      <LegalSection title={t("s2Title")} number={2}>
        <p>{t("s2p1")}</p>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <h4 className="text-gray-300 text-sm font-semibold mb-3">{t("s2sub1")}</h4>
          <LegalList items={parseList("s2list1")} />
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <h4 className="text-gray-300 text-sm font-semibold mb-3">{t("s2sub2")}</h4>
          <LegalList items={parseList("s2list2")} />
        </div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 3. How We Use Your Information ─── */}
      <LegalSection title={t("s3Title")} number={3}>
        <p>{t("s3p1")}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {parseList("s3items").map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
              <span className="text-gray-400 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 4. Log Files ─── */}
      <LegalSection title={t("s4Title")} number={4}>
        <p>{t("s4p1")}</p>
        <LegalList items={parseList("s4list")} />
        <p>{t("s4p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 5. Cookies ─── */}
      <LegalSection title={t("s5Title")} number={5}>
        <p>{t("s5p1")}</p>
        <LegalList items={parseList("s5list")} />
        <p>{t("s5p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 6. GDPR Rights ─── */}
      <LegalSection title={t("s6Title")} number={6}>
        <p>{t("s6p1")}</p>
        <div className="space-y-3">
          {parseList("s6rights").map((item: string, i: number) => {
            const [right, ...descParts] = item.split(": ");
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
                <div>
                  <span className="text-gray-300 text-sm font-medium">{right}: </span>
                  <span className="text-gray-400 text-sm">{descParts.join(": ")}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p>{t("s6p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 7. Children's Information ─── */}
      <LegalSection title={t("s7Title")} number={7}>
        <p>{t("s7p1")}</p>
        <p>{t("s7p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 8. Changes ─── */}
      <LegalSection title={t("s8Title")} number={8}>
        <p>{t("s8p1")}</p>
        <LegalList items={parseList("s8list")} />
        <p>{t("s8p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 9. Contact Us ─── */}
      <LegalSection title={t("s9Title")} number={9}>
        <p>{t("s9p1")}</p>
        <LegalContactCard items={[
          { label: "Email", value: t("s9email"), href: "mailto:booking@vipluxurycarrental.com" },
          { label: "Phone", value: t("s9phone"), href: "tel:+971501564849" },
          { label: "WhatsApp", value: t("s9whatsapp"), href: "https://wa.me/971501564849" },
          { label: "Address", value: t("s9address") },
        ]} />
      </LegalSection>
    </LegalPageLayout>
  );
}


