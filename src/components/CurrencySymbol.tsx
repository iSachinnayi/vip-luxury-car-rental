// ═══════════════════════════════════════════════
//  CurrencySymbol — Official UAE Dirham symbol SVG
// ═══════════════════════════════════════════════

export function AedSymbol({ className = "inline-block w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* D letter shape */}
      <path d="M4 4h10a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6H4V4z" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* Two horizontal lines (UAE flag inspired) */}
      <line x1="4" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" />
      <line x1="4" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function currencySymbolSvg(code: string): React.ReactNode | null {
  if (code === "AED") return <AedSymbol />;
  return null;
}
