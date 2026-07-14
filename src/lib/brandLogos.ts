// ═══════════════════════════════════════════════
//  Brand Logo Utility — User's custom WebP logos
//  Land Rover kept from vehiclespecs
// ═══════════════════════════════════════════════

const BRAND_FILES: Record<string, string> = {
  "Lamborghini": "lamborghini-logo.webp",
  "Ferrari": "ferrari-logo.webp",
  "Rolls Royce": "rolls-royce-logo.webp",
  "Bentley": "bentley-logo.webp",
  "Porsche": "porsche-logo.webp",
  "Mercedes": "mercedes-logo.webp",
  "Mercedes-Benz": "mercedes-logo.webp",
  "BMW": "bmw-logo.webp",
  "Audi": "audi-logo.webp",
  "Range Rover": "land-rover-logo.svg",
  "McLaren": "mclaren-logo.webp",
  "Nissan": "nissan-logo.webp",
  "Chevrolet": "chevrolet-logo.webp",
  "Cadillac": "cadillac-logo.webp",
  "GMC": "gmc-logo.webp",
  "Toyota": "toyota-logo.webp",
  "Tesla": "tesla-logo.webp",
  "Volkswagen": "volkswagen-logo.webp",
  "Mini Cooper": "mini-cooper-logo.webp",
  "Mini": "mini-cooper-logo.webp",
};

export function getBrandLogoUrl(brand: string): string | null {
  if (!brand?.trim()) return null;
  const file = BRAND_FILES[brand];
  if (file) return `/brand-logos/${file}`;
  return null;
}
