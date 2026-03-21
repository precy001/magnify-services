import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Phone, Mail } from "lucide-react";
import SectionHero from "@/components/sections/SectionHero";
import { SERVICES, CONTACT } from "@/lib/constants";

export default function Consultation() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "", email: "", phone: "", date: "", time: "", service: "", message: "",
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.service) e.service = "Select a service";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? "border-destructive" : "border-border"} bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all`;

  return (
    <>
      <SectionHero
        title="Book a Consultation"
        subtitle="Take the first step toward quality care for your loved one."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Consultation", href: "/consultation" }]}
      />

      <section className="section-padding">
        <div className="container max-w-2xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-success/10 border border-success/20 rounded-2xl p-12 text-center"
            >
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">Consultation Requested!</h3>
              <p className="text-muted-foreground">We'll be in touch within 24 hours to confirm your appointment.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl shadow-md p-8 md:p-10 space-y-5"
            >
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Full Name *</label>
                <input className={inputClass("name")} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Email Address *</label>
                  <input type="email" className={inputClass("email")} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Phone Number *</label>
                  <input type="tel" className={inputClass("phone")} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Your phone number" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Preferred Date *</label>
                  <input type="date" className={inputClass("date")} value={form.date} onChange={(e) => update("date", e.target.value)} />
                  {errors.date && <p className="text-destructive text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Preferred Time *</label>
                  <select className={inputClass("time")} value={form.time} onChange={(e) => update("time", e.target.value)}>
                    <option value="">Select time</option>
                    <option value="morning">Morning (9AM – 12PM)</option>
                    <option value="afternoon">Afternoon (12PM – 4PM)</option>
                    <option value="evening">Evening (4PM – 6PM)</option>
                  </select>
                  {errors.time && <p className="text-destructive text-xs mt-1">{errors.time}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Service of Interest *</label>
                <select className={inputClass("service")} value={form.service} onChange={(e) => update("service", e.target.value)}>
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.shortTitle}</option>
                  ))}
                </select>
                {errors.service && <p className="text-destructive text-xs mt-1">{errors.service}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Message / Additional Notes</label>
                <textarea className={`${inputClass("message")} min-h-[120px] resize-y`} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your needs..." />
              </div>
              <button type="submit" className="btn-primary w-full text-base !py-4">
                Request Consultation
              </button>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 bg-card rounded-2xl p-8 shadow-sm text-center"
          >
            <p className="text-muted-foreground text-sm mb-4">Prefer to reach us directly?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${CONTACT.phones[0]}`} className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-accent transition-colors">
                <Phone size={16} className="text-accent" /> {CONTACT.phones[0]}
              </a>
              <a href={`mailto:${CONTACT.emails[0]}`} className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-accent transition-colors">
                <Mail size={16} className="text-accent" /> {CONTACT.emails[0]}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
