// ═══════════════════════════════════════════════
//  Terms & Conditions — VIP Luxury Car Rental Dubai
//  Premium formatted with proper section hierarchy
// ═══════════════════════════════════════════════

import type { Metadata } from "next/types";
import { getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection, { LegalSubSection, LegalList, LegalDivider } from "@/components/legal/LegalSection";
import LegalContactCard from "@/components/legal/LegalContactCard";

export async function generateMetadata() {
  const t = await getTranslations("terms");
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const sections = [
    { id: "introduction", label: t("s1Label") },
    { id: "booking-payment-policy", label: t("s2Label") },
    { id: "cancellation-refund-policy", label: t("s3Label") },
    { id: "rental-period-vehicle-return", label: t("s4Label") },
    { id: "general-terms-conditions", label: t("s5Label") },
    { id: "geographic-borders", label: t("s6Label") },
    { id: "kilometer-allowance", label: t("s7Label") },
    { id: "insurance-accidents-damages", label: t("s8Label") },
    { id: "other-payments-fees", label: t("s9Label") },
    { id: "contact-us", label: t("s10Label") },
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
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400 text-sm">{t("s1warning")}</div>
        <p>{t("s1p3")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 2. Booking & Payment ─── */}
      <LegalSection title={t("s2Title")} number={2}>
        <p>{t("s2p1")}</p>
        <LegalSubSection title={t("s2sub1")}>
          <LegalList items={parseList("s2list1")} />
        </LegalSubSection>
        <LegalSubSection title={t("s2sub2")}>
          <p>{t("s2p2")}</p>
        </LegalSubSection>
      </LegalSection>

      <LegalDivider />

      {/* ─── 3. Cancellation & Refund ─── */}
      <LegalSection title={t("s3Title")} number={3}>
        <p>{t("s3p1")}</p>
        <LegalSubSection title={t("s3sub1")}>
          <LegalList items={parseList("s3list1")} />
        </LegalSubSection>
        <LegalSubSection title={t("s3sub2")}>
          <LegalList items={parseList("s3list2")} />
        </LegalSubSection>
      </LegalSection>

      <LegalDivider />

      {/* ─── 4. Rental Period ─── */}
      <LegalSection title={t("s4Title")} number={4}>
        <LegalList items={parseList("s4list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 5. General Terms ─── */}
      <LegalSection title={t("s5Title")} number={5}>
        <div className="space-y-2">
          {parseList("s5items").map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
              <span className="text-gray-400 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 6. Geographic Borders ─── */}
      <LegalSection title={t("s6Title")} number={6}>
        <p>{t("s6p1")}</p>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm">{t("s6warning")}</div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 7. Kilometers ─── */}
      <LegalSection title={t("s7Title")} number={7}>
        <p>{t("s7p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 8. Insurance ─── */}
      <LegalSection title={t("s8Title")} number={8}>
        <LegalSubSection title={t("s8sub1")}>
          <LegalList items={parseList("s8list1")} />
        </LegalSubSection>
        <LegalSubSection title={t("s8sub2")}>
          <LegalList items={parseList("s8list2")} />
        </LegalSubSection>
      </LegalSection>

      <LegalDivider />

      {/* ─── 9. Other Fees ─── */}
      <LegalSection title={t("s9Title")} number={9}>
        <div className="space-y-2">
          {parseList("s9items").map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-1.5 shrink-0" />
              <span className="text-gray-400 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 10. Contact Us ─── */}
      <LegalSection title={t("s10Title")} number={10}>
        <p>{t("s10p1")}</p>
        <LegalContactCard items={[
          { label: "Email", value: t("s10email"), href: "mailto:booking@vipluxurycarrental.com" },
          { label: "Phone", value: t("s10phone"), href: "tel:+971501564849" },
          { label: "WhatsApp", value: t("s10whatsapp"), href: "https://wa.me/971501564849" },
          { label: "Address", value: t("s10address") },
        ]} />
      </LegalSection>
    </LegalPageLayout>
  );
}
