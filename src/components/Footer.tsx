// ═══════════════════════════════════════════════
//  Footer — Links + Contact + Social
// ═══════════════════════════════════════════════

import Link from "next/link";

const BRANDS = [
  "Lamborghini", "Ferrari", "Rolls Royce", "Bentley", "Porsche",
  "Mercedes", "BMW", "Audi", "Range Rover", "Nissan",
  "Chevrolet", "McLaren", "Cadillac", "GMC", "Toyota",
];

const QUICK_LINKS = [
  { label: "All Cars", href: "/all-cars" },
  { label: "Brands", href: "/brand" },
  { label: "Luxury Cars", href: "/luxury-car-rental-in-dubai" },
  { label: "Sports Cars", href: "/sports-car-rental-in-dubai" },
  { label: "SUV Rental", href: "/suv-car-rental-in-dubai" },
];

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl font-bold text-white">VIP</span>
              <span className="block text-xs text-gray-500 uppercase tracking-widest mt-1">
                Luxury Car Rental Dubai
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium luxury car rental in Dubai. 350+ sports cars, luxury SUVs, 
              and exotic vehicles with free delivery across the UAE.
            </p>
            {/* Payment Badge */}
            <img
              src="/safe-payment.webp"
              alt="Safe Payment"
              className="h-8 opacity-60"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Brands
            </h4>
            <ul className="space-y-2.5">
              {BRANDS.slice(0, 10).map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/rent-${brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai`}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>Al Barsha Near Mall Of Emirates, Dubai</span>
              </p>
              <a href="tel:+971501564849" className="flex items-center gap-2 hover:text-gold transition-colors">
                <span>📞</span>
                <span>+971 50 156 4849</span>
              </a>
              <a href="mailto:booking@vipluxurycarrental.com" className="flex items-center gap-2 hover:text-gold transition-colors break-all">
                <span>✉️</span>
                <span>booking@vipluxurycarrental.com</span>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/971501564849"
                target="_blank"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} VIP Luxury Car Rental. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
