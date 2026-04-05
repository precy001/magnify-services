import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { CONTACT, NAV_LINKS, SERVICES } from "@/lib/constants";
import { useState } from "react";
import logo from "@/assets/logo.png";

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
                src={logo}
                alt="Magnify Services logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Providing specialized adult foster care for individuals who deserve comfort, respect, and a place to call home.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
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
              {CONTACT.phones.slice(0, 2).map((p) => (
                <li key={p} className="flex items-center gap-2 text-white/60 text-sm">
                  <Phone size={14} className="text-accent shrink-0" />
                  <a href={`tel:${p}`} className="hover:text-accent transition-colors">{p}</a>
                </li>
              ))}
              {CONTACT.emails.slice(0, 1).map((e) => (
                <li key={e} className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail size={14} className="text-accent shrink-0" />
                  <a href={`mailto:${e}`} className="hover:text-accent transition-colors break-all">{e}</a>
                </li>
              ))}
              {CONTACT.locations.map((loc) => (
                <li key={loc.name} className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><span className="text-white/80 font-medium">{loc.name}</span> — {loc.address}</span>
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
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 text-white text-sm placeholder:text-white/40 border border-white/10 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:scale-105 active:scale-95 transition-transform"
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
            © 2026 Magnify Services. All rights reserved.
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
