// ═══════════════════════════════════════════════
//  Legal Section — Shared section component
//  With gold accent border, section number, heading
// ═══════════════════════════════════════════════

interface LegalSectionProps {
  title: string;
  number?: number;
  children: React.ReactNode;
  id?: string;
}

export default function LegalSection({ title, number, children, id }: LegalSectionProps) {
  const sectionId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <section id={sectionId} className="mb-10 scroll-mt-28">
      {/* Gold accent bar + heading */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-0.5 h-auto min-h-[28px] bg-gradient-to-b from-gold via-gold/60 to-transparent rounded-full mt-1.5 shrink-0" />
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-white flex items-center gap-3">
            {number && (
              <span className="text-xs font-sans font-bold text-gold/60 bg-gold/5 px-2 py-0.5 rounded-md border border-gold/10">
                {String(number).padStart(2, "0")}
              </span>
            )}
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="pl-6 space-y-4 text-gray-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function LegalSubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-white text-sm font-semibold mb-2.5 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
        {title}
      </h3>
      <div className="text-gray-400 text-sm leading-relaxed space-y-2 pl-4">
        {children}
      </div>
    </div>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40 mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-8" />
  );
}
