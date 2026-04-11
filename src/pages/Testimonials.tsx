import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { CheckCircle } from "lucide-react";

const testimonials = [
  { quote: "Finding the right place for my father was not easy, but Magnify Services Inc. gave us peace of mind from day one. The environment is warm, safe, and welcoming, and the caregivers treat him like family. We finally feel confident he's in the right hands", name: "Mrs. Johnson", relationship: "Daughter of Resident" },
  { quote: "Living at Magnify Services has been a blessing. I feel respected, cared for, and supported every day. The staff are patient and kind, and they make this place truly feel like home.", name: "James K", relationship: "Resident" },
  { quote: "Before Magnify, my sister struggled with consistent care. Since moving here, we've seen a complete transformation—she's happier, healthier, and more engaged. The team genuinely cares, and it shows in everything they do", name: "Angela M.", relationship: "Family Member" },
  { quote: "As a healthcare provider, I've worked with several care homes, and Magnify Services Inc. stands out for their professionalism and attention to detail. Their staff are well-trained, attentive, and deeply committed to the well-being of their residents", name: " Dr. Williams", relationship: "Healthcare Partner" },
  { quote: "Magnify Services goes beyond basic care—they create a supportive and structured environment where residents can thrive. Communication with families is excellent, and their dedication is unmatched.", name: "David O", relationship: "Legal Guardian" },
  { quote: "A safe home, a caring team, and real peace of mind", name: "Family Review", relationship: "" },
  { quote: "They treat every resident with dignity and respect.", name: "Client Feedback", relationship: "" },
  { quote: "Placing a loved one in care is never easy, but Magnify Services made that transition feel right. They didn't just accept my mother—they embraced her. The love, patience, and attention they show every day mean everything to our family.", name: "Family Testimonial", relationship: "" },
];

export default function Testimonials() {
  const gridAnim = useScrollAnimation();
  const formAnim = useScrollAnimation();
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [storyForm, setStoryForm] = useState({ name: "", relationship: "", story: "" });

  const handleStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyForm.name && storyForm.story) setStorySubmitted(true);
  };

  return (
    <>
      <SectionHero
        title="What Families Say"
        subtitle="Real stories from real families."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials", href: "/testimonials" }]}
      />

      <section ref={gridAnim.ref} className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={gridAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <TestimonialCard {...t} variant={i % 2 === 0 ? "white" : "ice"} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={formAnim.ref} className="ice-blue-bg section-padding">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-3">Share Your Story</h2>
            <p className="text-muted-foreground mb-8">Had an experience with Magnify Services Inc? We'd love to hear from you.</p>
          </motion.div>

          {storySubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-success/10 border border-success/20 rounded-lg p-10">
              <CheckCircle size={40} className="text-success mx-auto mb-3" />
              <h3 className="text-xl font-bold text-primary mb-1">Thank You!</h3>
              <p className="text-muted-foreground text-sm">Your story has been submitted and may be featured on our site.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={formAnim.isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleStory}
              className="bg-card rounded-lg shadow-sm p-8 space-y-5 text-left border border-border"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Your Name</label>
                  <input className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={storyForm.name} onChange={(e) => setStoryForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Relationship</label>
                  <input className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={storyForm.relationship} onChange={(e) => setStoryForm(f => ({ ...f, relationship: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Your Story</label>
                <textarea className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[150px] resize-y" value={storyForm.story} onChange={(e) => setStoryForm(f => ({ ...f, story: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary w-full">Submit Your Story</button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
