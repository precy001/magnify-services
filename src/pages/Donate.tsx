import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import { CheckCircle, Utensils, Stethoscope, GraduationCap, Building } from "lucide-react";

const presets = [25, 50, 100, 250];

const donationHelps = [
  { icon: Utensils, title: "Meals & Nutrition", desc: "Providing healthy, balanced meals for residents daily." },
  { icon: Stethoscope, title: "Medical Supplies", desc: "Essential health and medical supplies for quality care." },
  { icon: GraduationCap, title: "Staff Training", desc: "Continuous professional development for caregivers." },
  { icon: Building, title: "Facility Improvements", desc: "Upgrading facilities for comfort and accessibility." },
];

const allocation = [
  { label: "Resident Care", pct: 55 },
  { label: "Staff & Training", pct: 20 },
  { label: "Facilities", pct: 15 },
  { label: "Community Programs", pct: 10 },
];

export default function Donate() {
  const [donationType, setDonationType] = useState<"one-time" | "monthly" | "sponsor">("one-time");
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const helpsAnim = useScrollAnimation();
  const transparencyAnim = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((amount || customAmount) && form.name && form.email) setSubmitted(true);
  };

  const selectedAmount = amount || (customAmount ? Number(customAmount) : 0);

  return (
    <>
      <SectionHero
        title="Support Our Mission"
        subtitle="Your generosity makes compassionate care possible."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Donate", href: "/donate" }]}
      />

      <section className="section-padding">
        <div className="container">
          {/* Donation Type Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { type: "one-time" as const, title: "One-Time Donation", desc: "Give once, make a lasting difference." },
              { type: "monthly" as const, title: "Monthly Support", desc: "Become a sustaining supporter." },
              { type: "sponsor" as const, title: "Sponsorship", desc: "Sponsor a resident's care." },
            ].map((d) => (
              <button
                key={d.type}
                onClick={() => setDonationType(d.type)}
                className={`p-8 rounded-2xl text-left transition-all duration-300 ${
                  donationType === d.type
                    ? "bg-accent/10 border-2 border-accent shadow-md"
                    : "bg-card border-2 border-transparent shadow-sm hover:shadow-md"
                }`}
              >
                <h3 className="font-semibold text-primary text-lg mb-2">{d.title}</h3>
                <p className="text-muted-foreground text-sm">{d.desc}</p>
                {d.type === "monthly" && donationType === "monthly" && (
                  <span className="inline-block mt-3 label-accent text-accent bg-accent/10 px-3 py-1 rounded-full">Monthly</span>
                )}
              </button>
            ))}
          </div>

          {/* Donation Form */}
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto bg-success/10 border border-success/20 rounded-2xl p-12 text-center">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your donation of ${selectedAmount} will make a real difference.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-card rounded-2xl shadow-md p-8 md:p-10 space-y-6">
              <div>
                <label className="text-sm font-medium text-primary mb-3 block">Select Amount</label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setAmount(p); setCustomAmount(""); }}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        amount === p ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                      }`}
                    >
                      ${p}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Full Name</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 rounded-full bg-[#3bb75e] text-white font-semibold text-base hover:bg-[#35a553] transition-colors active:scale-[0.98]">
                Proceed to Payment — Secured by Paystack
              </button>
            </form>
          )}
        </div>
      </section>

      {/* How Donation Helps */}
      <section ref={helpsAnim.ref} className="ice-blue-bg section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={helpsAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">How Your Donation Helps</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationHelps.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 24 }}
                animate={helpsAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <h.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">{h.title}</h3>
                <p className="text-muted-foreground text-xs">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section ref={transparencyAnim.ref} className="section-padding">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={transparencyAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">Where Your Money Goes</h2>
            <div className="space-y-4">
              {allocation.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={transparencyAnim.isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary">{a.label}</span>
                    <span className="text-muted-foreground">{a.pct}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={transparencyAnim.isInView ? { width: `${a.pct}%` } : {}}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
