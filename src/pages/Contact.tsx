import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import { CONTACT } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const infoAnim = useScrollAnimation();
  const mapAnim = useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Unable to reach the server. Please try again.");
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
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-8 space-y-5 border border-border">
                  <div>
                    <label className="text-sm font-medium text-primary mb-1.5 block">Full Name *</label>
                    <input required className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">Email *</label>
                      <input required type="email" className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
                      <input type="tel" className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary mb-1.5 block">Subject</label>
                    <select className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}>
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
                    <textarea required className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[150px] resize-y" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full text-base !py-4">
                    Send Message
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
