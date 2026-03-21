import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import TeamCard from "@/components/cards/TeamCard";
import { Link } from "react-router-dom";

const categories = ["All", "Leadership", "Caregivers", "Nurses", "Therapists"];

const team = [
  { name: "Dr. Tife Iyiade", role: "Founder & Director", bio: "Visionary leader with 15+ years in adult foster care and community health.", tag: "MD, Public Health", category: "Leadership" },
  { name: "Sammi Kee", role: "Co-Founder & Operations", bio: "Expert in care facility operations and staff development programs.", tag: "MBA, Healthcare Mgmt", category: "Leadership" },
  { name: "Adeola Fashola", role: "Head of Nursing", bio: "Registered nurse dedicated to maintaining the highest clinical care standards.", tag: "RN, BSN", category: "Leadership" },
  { name: "Ngozi Aniebo", role: "Senior Caregiver", bio: "Compassionate caregiver specializing in developmental disability support.", tag: "Certified CNA", category: "Caregivers" },
  { name: "Emeka Udoh", role: "Lead Caregiver", bio: "Experienced in aging adult care with a focus on mobility and companionship.", tag: "Certified CNA", category: "Caregivers" },
  { name: "Aisha Mohammed", role: "Caregiver", bio: "Trained in mental health support and emotional wellness programs.", tag: "Certified CNA", category: "Caregivers" },
  { name: "Florence Oguike", role: "Registered Nurse", bio: "Specializes in medication management and health monitoring for residents.", tag: "RN, BSN", category: "Nurses" },
  { name: "Chukwu Okonkwo", role: "Nurse Practitioner", bio: "Provides primary care assessments and coordinates with external physicians.", tag: "NP, MSN", category: "Nurses" },
  { name: "Dr. Yemi Alade", role: "Physical Therapist", bio: "Designs rehabilitation programs to maximize resident mobility and independence.", tag: "DPT", category: "Therapists" },
  { name: "Patience Okoro", role: "Occupational Therapist", bio: "Helps residents develop daily living skills and adaptive strategies.", tag: "OTR/L", category: "Therapists" },
  { name: "Daniel Aminu", role: "Mental Health Counselor", bio: "Provides therapeutic support and emotional wellness counseling.", tag: "LPC, MA", category: "Therapists" },
  { name: "Bola Akinyemi", role: "Speech Therapist", bio: "Assists residents with communication challenges and cognitive exercises.", tag: "CCC-SLP", category: "Therapists" },
];

export default function Team() {
  const [filter, setFilter] = useState("All");
  const gridAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  const filtered = filter === "All" ? team : team.filter((t) => t.category === filter);

  return (
    <>
      <SectionHero
        title="Meet Our Team"
        subtitle="Dedicated professionals who care deeply."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team", href: "/team" }]}
      />

      <section ref={gridAnim.ref} className="section-padding">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                animate={gridAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <TeamCard {...member} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={ctaAnim.ref} className="ice-blue-bg section-padding">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Passionate about care? Join the Magnify Services family and make a meaningful difference.
            </p>
            <Link to="/contact" className="btn-primary">View Open Positions</Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
