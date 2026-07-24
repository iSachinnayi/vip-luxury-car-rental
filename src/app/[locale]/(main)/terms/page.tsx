// ═══════════════════════════════════════════════
//  Terms & Conditions — VIP Luxury Car Rental Dubai
//  Based on industry-standard rental terms
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
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const sections = [
    { id: "online-payment-policy", label: t("s1Label") },
    { id: "privacy-policy", label: t("s2Label") },
    { id: "cancellation-policy", label: t("s3Label") },
    { id: "refund-policy", label: t("s4Label") },
    { id: "no-show-policy", label: t("s5Label") },
    { id: "modifications-reservations", label: t("s6Label") },
    { id: "general-terms-conditions", label: t("s7Label") },
    { id: "geographic-borders", label: t("s8Label") },
    { id: "kilometres", label: t("s9Label") },
    { id: "insurance-accidents-damages", label: t("s10Label") },
    { id: "rental-period-vehicle-return", label: t("s11Label") },
    { id: "other-payments-fees", label: t("s12Label") },
    { id: "general-terms", label: t("s13Label") },
  ];

  const parseList = (key: string) => JSON.parse(t(key));
  return (
    <LegalPageLayout
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      sections={sections}
    >
      {/* ─── 1. Online Payment Policy ─── */}
      <LegalSection title={t("s1Title")} number={1}>
        <p>{t("s1p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 2. Privacy Policy ─── */}
      <LegalSection title={t("s2Title")} number={2}>
        <p>{t("s2p1")}</p>
      </LegalSection>

      <LegalDivider />

      {/* ─── 3. Cancellation Policy ─── */}
      <LegalSection title={t("s3Title")} number={3}>
        <LegalList items={parseList("s3list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 4. Refund Policy ─── */}
      <LegalSection title={t("s4Title")} number={4}>
        <LegalList items={parseList("s4list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 5. No-Show Policy ─── */}
      <LegalSection title={t("s5Title")} number={5}>
        <LegalList items={parseList("s5list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 6. Modifications to Reservations ─── */}
      <LegalSection title={t("s6Title")} number={6}>
        <LegalList items={parseList("s6list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 7. General Terms and Conditions ─── */}
      <LegalSection title={t("s7Title")} number={7}>
        <LegalList items={parseList("s7list")} />
        <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs font-semibold text-gold/60 uppercase tracking-wider mb-2">Accepted Countries</p>
          <p className="text-sm text-gray-400 leading-relaxed">{t("s7countries")}</p>
        </div>
      </LegalSection>

      <LegalDivider />

      {/* ─── 8. Geographic Borders ─── */}
      <LegalSection title={t("s8Title")} number={8}>
        <LegalList items={parseList("s8list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 9. Kilometres ─── */}
      <LegalSection title={t("s9Title")} number={9}>
        <LegalList items={parseList("s9list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 10. Insurance, Accidents, and Damages ─── */}
      <LegalSection title={t("s10Title")} number={10}>
        <LegalList items={parseList("s10list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 11. Rental Period and Vehicle Returning ─── */}
      <LegalSection title={t("s11Title")} number={11}>
        <LegalList items={parseList("s11list")} />
      </LegalSection>

      <LegalDivider />

      {/* ─── 12. Other Payments and Fees ─── */}
      <LegalSection title={t("s12Title")} number={12}>
        <LegalSubSection title={t("s12sub1Label")}>
          <LegalList items={parseList("s12sub1List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub2Label")}>
          <LegalList items={parseList("s12sub2List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub3Label")}>
          <LegalList items={parseList("s12sub3List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub4Label")}>
          <LegalList items={parseList("s12sub4List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub5Label")}>
          <LegalList items={parseList("s12sub5List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub6Label")}>
          <LegalList items={parseList("s12sub6List")} />
        </LegalSubSection>
        <LegalSubSection title={t("s12sub7Label")}>
          <LegalList items={parseList("s12sub7List")} />
        </LegalSubSection>
      </LegalSection>

      <LegalDivider />

      {/* ─── 13. General Terms ─── */}
      <LegalSection title={t("s13Title")} number={13}>
        <LegalList items={parseList("s13list")} />
      </LegalSection>
    </LegalPageLayout>
  );
}
