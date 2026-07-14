// ═══════════════════════════════════════════════
//  AED Currency Symbol — Text only
// ═══════════════════════════════════════════════

interface IconProps {
  className?: string;
  size?: number;
}

export function AedSymbolIcon({ className, size }: IconProps) {
  return <span className={className} style={{ display: "inline-block", verticalAlign: "middle", fontSize: size ? `${size}px` : "16px", fontWeight: 600 }}>AED</span>;
}
