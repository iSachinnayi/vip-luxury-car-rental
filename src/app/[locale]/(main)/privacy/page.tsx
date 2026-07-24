// ═══════════════════════════════════════════════
//  Privacy Policy — VIP Luxury Car Rental Dubai
//  Based on industry-standard privacy policy
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
    { id: "consent", label: t("s2Label") },
    { id: "information-we-collect", label: t("s3Label") },
    { id: "how-we-use-your-information", label: t("s4Label") },
    { id: "log-files", label: t("s5Label") },
    { id: "cookies-and-web-beacons", label: t("s6Label") },
    { id: "advertising-partners", label: t("s7Label") },
    { id: "third-party-policies", label: t("s8Label") },
    { id: "ccpa-rights", label: t("s9Label") },
    { id: "gdpr-rights", label: t("s10Label") },
    { id: "childrens-information", label: t("s11Label") },
    { id: "policy-changes", label: t("s12Label") },
    { id: "contact-us", label: t("s13Label") },
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

      {/* ─── 2. Consent ─── */}
      <LegalSection title={t("s2Title")} number={2}>
        <p>{t("s2p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 3. Information We Collect ─── */}
      <LegalSection title={t("s3Title")} number={3}>
        <p>{t("s3p1")}</p>
        <p>{t("s3p2")}</p>
        <p>{t("s3p3")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 4. How We Use Your Information ─── */}
      <LegalSection title={t("s4Title")} number={4}>
        <p>{t("s4p1")}</p>
        <LegalList items={parseList("s4list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 5. Log Files ─── */}
      <LegalSection title={t("s5Title")} number={5}>
        <p>{t("s5p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 6. Cookies and Web Beacons ─── */}
      <LegalSection title={t("s6Title")} number={6}>
        <p>{t("s6p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 7. Advertising Partners ─── */}
      <LegalSection title={t("s7Title")} number={7}>
        <p>{t("s7p1")}</p>
        <p>{t("s7p2")}</p>
        <p>{t("s7p3")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 8. Third Party Policies ─── */}
      <LegalSection title={t("s8Title")} number={8}>
        <p>{t("s8p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 9. CCPA Rights ─── */}
      <LegalSection title={t("s9Title")} number={9}>
        <p>{t("s9p1")}</p>
        <LegalList items={parseList("s9list")} />
        <p className="mt-3">{t("s9p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 10. GDPR Rights ─── */}
      <LegalSection title={t("s10Title")} number={10}>
        <p>{t("s10p1")}</p>
        <div className="space-y-3">
          {parseList("s10list").map((item: string, i: number) => {
            const [right, ...descParts] = item.split(" - ");
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
                <div>
                  <span className="text-gray-300 text-sm font-medium">{right}: </span>
                  <span className="text-gray-400 text-sm">{descParts.join(" - ")}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3">{t("s10p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 11. Children's Information ─── */}
      <LegalSection title={t("s11Title")} number={11}>
        <p>{t("s11p1")}</p>
        <p>{t("s11p2")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 12. Changes to This Privacy Policy ─── */}
      <LegalSection title={t("s12Title")} number={12}>
        <p>{t("s12p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 13. Contact Us ─── */}
      <LegalSection title={t("s13Title")} number={13}>
        <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
        <LegalContactCard items={[
          { label: "Email", value: "booking@vipluxurycarrental.com", href: "mailto:booking@vipluxurycarrental.com" },
          { label: "Phone", value: "+971 50 156 4849", href: "tel:+971501564849" },
          { label: "WhatsApp", value: "+971 50 156 4849", href: "https://wa.me/971501564849" },
          { label: "Address", value: "Al Barsha, Near Mall of Emirates, Dubai, UAE" },
        ]} />
      </LegalSection>
    </LegalPageLayout>
  );
}


