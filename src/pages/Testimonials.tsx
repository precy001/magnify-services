import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { CheckCircle } from "lucide-react";

const testimonials = [
  { quote: "Magnify Services gave my mother a second home. The caregivers treat her with such warmth and dignity — we couldn't ask for more.", name: "Adebayo Oluwa", relationship: "Son of Resident" },
  { quote: "The level of professionalism and genuine compassion at this facility is unmatched. Our family has complete peace of mind.", name: "Grace Nwachukwu", relationship: "Daughter of Resident" },
  { quote: "From the moment we walked in, we knew this was the right place. The staff goes above and beyond every single day.", name: "Samuel Okafor", relationship: "Family Member" },
  { quote: "My brother has thrived since joining Magnify Services. The personalized care plan has made a world of difference.", name: "Chioma Eze", relationship: "Sister of Resident" },
  { quote: "We were worried about finding the right care for our father. Magnify Services exceeded every expectation we had.", name: "Funke Adeyemi", relationship: "Daughter of Resident" },
  { quote: "The communication from the team is outstanding. We're always informed and involved in our mother's care journey.", name: "Tunde Bakare", relationship: "Son of Resident" },
  { quote: "What sets Magnify apart is the genuine love and attention each resident receives. It's not just a facility — it's a family.", name: "Amara Obi", relationship: "Niece of Resident" },
  { quote: "I recommend Magnify Services to everyone. Their dedication to quality care is evident in everything they do.", name: "Ibrahim Musa", relationship: "Brother of Resident" },
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
            <p className="text-muted-foreground mb-8">Had an experience with Magnify Services? We'd love to hear from you.</p>
          </motion.div>

          {storySubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-success/10 border border-success/20 rounded-2xl p-10">
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
              className="bg-card rounded-2xl shadow-sm p-8 space-y-5 text-left"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Your Name</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={storyForm.name} onChange={(e) => setStoryForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1.5 block">Relationship</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" value={storyForm.relationship} onChange={(e) => setStoryForm(f => ({ ...f, relationship: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Your Story</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[150px] resize-y" value={storyForm.story} onChange={(e) => setStoryForm(f => ({ ...f, story: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary w-full">Submit Your Story</button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
