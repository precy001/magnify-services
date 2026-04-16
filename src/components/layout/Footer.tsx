import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Linkedin, Send } from "lucide-react";
import { CONTACT, NAV_LINKS, SERVICES } from "@/lib/constants";
import { useState } from "react";
import logoWhite from "@/assets/logo-white.png";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.01a6.34 6.34 0 0 0-.88-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.84z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="navy-bg text-white/90">
      <div className="container section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoWhite}
                alt="Magnify Services Inc logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Providing specialized adult foster care for individuals who deserve comfort, respect, and a place to call home.
            </p>
            <div className="flex gap-3">
              <a
                href={CONTACT.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={CONTACT.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={CONTACT.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Services</h4>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    className="text-white/60 text-sm hover:text-accent transition-colors duration-200"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Contact</h4>
            <ul className="space-y-3 mb-8">
              {CONTACT.phones.map((p) => (
                <li key={p} className="flex items-center gap-2 text-white/60 text-sm">
                  <Phone size={14} className="text-accent shrink-0" />
                  <a href={`tel:${p}`} className="hover:text-accent transition-colors">{p}</a>
                </li>
              ))}
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone size={14} className="text-accent shrink-0" />
                <span>Fax: {CONTACT.fax}</span>
              </li>
              {CONTACT.emails.map((e) => (
                <li key={e} className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail size={14} className="text-accent shrink-0" />
                  <a href={`mailto:${e}`} className="hover:text-accent transition-colors break-all">{e}</a>
                </li>
              ))}
              {CONTACT.locations.map((loc) => (
                <li key={loc.name} className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    <span className="text-white/80 font-medium">{loc.name}</span> — {loc.address}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold text-sm mb-3">Newsletter</h4>
            {subscribed ? (
              <p className="text-accent text-sm">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 rounded-md bg-white/10 text-white text-sm placeholder:text-white/40 border border-white/10 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-accent-foreground hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2026 Magnify Services Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 text-xs hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 text-xs hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
