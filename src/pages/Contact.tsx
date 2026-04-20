import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import { CONTACT } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;

// The contact form posts to the PHP endpoint. In development, vite.config.ts
// proxies /api to a local `php -S` server (see PHP_SETUP.md).
const SUBMIT_URL = "/api/submit.php";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const infoAnim = useScrollAnimation();
  const mapAnim = useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setFieldErrors({});

    // Minimal client-side check; the PHP endpoint is the source of truth.
    if (!form.name || !form.email || !form.message) {
      setFormError("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // `website` is a honeypot field — empty for humans, filled by bots.
        body: JSON.stringify({ ...form, website: "" }),
      });

      let data: { ok?: boolean; error?: string; fields?: FieldErrors } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response (e.g., HTML error page from the server).
      }

      if (res.ok && data.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        return;
      }

      if (res.status === 422 && data.fields) {
        setFieldErrors(data.fields);
        setFormError(data.error ?? "Please check the fields below.");
      } else if (res.status === 429) {
        setFormError(data.error ?? "Too many submissions. Please try again later.");
      } else {
        setFormError(data.error ?? "Something went wrong sending your message. Please try again.");
      }
    } catch {
      setFormError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SectionHero
        title="Get in Touch"
        subtitle="We're here to answer your questions."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]}
      />

      <section ref={infoAnim.ref} className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={infoAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <Phone size={16} className="text-accent" /> Phone Numbers
                  </h4>
                  <ul className="space-y-2 ml-6">
                    {CONTACT.phones.map((p) => (
                      <li key={p}>
                        <a href={`tel:${p}`} className="text-body text-sm hover:text-accent transition-colors">{p}</a>
                      </li>
                    ))}
                    <li className="text-body text-sm">Fax: {CONTACT.fax}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <Mail size={16} className="text-accent" /> Email Addresses
                  </h4>
                  <ul className="space-y-2 ml-6">
                    {CONTACT.emails.map((e) => (
                      <li key={e}>
                        <a href={`mailto:${e}`} className="text-body text-sm hover:text-accent transition-colors break-all">{e}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-accent" /> Our Locations
                  </h4>
                  <ul className="space-y-2 ml-6">
                    {CONTACT.locations.map((loc) => (
                      <li key={loc.name} className="text-sm">
                        <span className="font-medium text-primary">{loc.name}</span>
                        <span className="text-body"> — {loc.address}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 ml-6">Licensed under: {CONTACT.licenseName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-accent" /> Visiting Hours
                  </h4>
                  <p className="text-body text-sm ml-6">{CONTACT.hours}</p>
                </div>
              </div>

              {/* Emergency Card */}
              <div className="mt-10 bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-start gap-3">
                <AlertTriangle size={20} className="text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary text-sm mb-1">Urgent Care Inquiries</p>
                  <p className="text-body text-sm">
                    Call us directly at{" "}
                    <a href={`tel:${CONTACT.phones[0]}`} className="font-semibold text-primary hover:text-accent transition-colors">
                      {CONTACT.phones[0]}
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={infoAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {submitted ? (
                <div className="bg-success/10 border border-success/20 rounded-lg p-12 text-center h-full flex flex-col items-center justify-center">
                  <CheckCircle size={48} className="text-success mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-accent hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-8 space-y-5 border border-border" noValidate>
                  {formError && (
                    <div
                      role="alert"
                      className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-4 py-3"
                    >
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-primary mb-1.5 block">Full Name *</label>
                    <input
                      required
                      className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      disabled={isSubmitting}
                      aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">Email *</label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.email}
                      />
                      {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldErrors.phone}
                      />
                      {fieldErrors.phone && <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-1.5 block">Subject</label>
                    <select
                      className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="service">Service Information</option>
                      <option value="consultation">Consultation</option>
                      <option value="donation">Donation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-1.5 block">Message *</label>
                    <textarea
                      required
                      className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[150px] resize-y"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      disabled={isSubmitting}
                      aria-invalid={!!fieldErrors.message}
                    />
                    {fieldErrors.message && <p className="text-xs text-destructive mt-1">{fieldErrors.message}</p>}
                  </div>

                  {/* Honeypot — hidden from humans, tempts bots. */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
                    <label>
                      Website (leave blank)
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        onChange={() => { /* ignored — honeypot */ }}
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-base !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section ref={mapAnim.ref} className="section-padding-sm">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={mapAnim.isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container"
        >
          <h3 className="text-xl font-bold text-primary mb-6 text-center">Our Locations</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {CONTACT.locations.map((loc) => (
              <div key={loc.name} className="rounded-lg overflow-hidden shadow-md border border-border">
                <iframe
                  title={`Map - ${loc.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - 0.005}%2C${loc.lat - 0.003}%2C${loc.lng + 0.005}%2C${loc.lat + 0.003}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`}
                  className="w-full h-[250px] border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="bg-card p-4">
                  <p className="font-semibold text-primary text-sm">{loc.name}</p>
                  <p className="text-muted-foreground text-xs">{loc.address}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
