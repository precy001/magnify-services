import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import StatsCounter from "@/components/sections/StatsCounter";
import ProjectCard from "@/components/cards/ProjectCard";
import CTABanner from "@/components/sections/CTABanner";
import communityImg from "@/assets/activities-5.jpg";

const projects = [
  { title: "Community Wellness Initiative", category: "Community Programs", description: "A comprehensive wellness program bringing health screenings and wellness education to underserved communities." },
  { title: "Mental Health Awareness Campaign", category: "Health Initiatives", description: "Raising awareness about mental health challenges facing adults in foster care through education and outreach." },
  { title: "Caregiver Training Academy", category: "Education", description: "An intensive training program equipping caregivers with specialized skills in adult foster care." },
  { title: "Annual Family Day Celebration", category: "Events", description: "A heartwarming annual event bringing together residents, families, and staff for a day of connection." },
  { title: "Adaptive Living Workshop", category: "Education", description: "Teaching residents and caregivers about adaptive technologies and independent living strategies." },
  { title: "Nutrition & Wellness Program", category: "Health Initiatives", description: "Implementing personalized nutrition plans and wellness activities to improve resident health outcomes." },
];

const milestones = [
  { year: "2010", desc: "Organization founded" },
  { year: "2013", desc: "First facility expansion" },
  { year: "2016", desc: "Mental health programs launched" },
  { year: "2019", desc: "50+ trained staff" },
  { year: "2022", desc: "Community service award" },
  { year: "2025", desc: "500+ residents served" },
];

export default function Projects() {
  const gridAnim = useScrollAnimation();
  const timelineAnim = useScrollAnimation();
  const communityAnim = useScrollAnimation();

  return (
    <>
      <SectionHero
        title="Our Impact"
        subtitle="Programs and initiatives that change lives."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }]}
      />

      <section ref={gridAnim.ref} className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label-accent text-accent mb-3 block">Featured</span>
            <h2 className="text-3xl md:text-4xl font-bold">Our Projects</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                animate={gridAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <ProjectCard {...p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsCounter />

      {/* Horizontal Timeline */}
      <section ref={timelineAnim.ref} className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={timelineAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="label-accent text-accent mb-3 block">Milestones</span>
            <h2 className="text-3xl font-bold">Our Journey</h2>
          </motion.div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 16 }}
                animate={timelineAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="min-w-[200px] bg-card rounded-lg p-6 shadow-sm snap-start text-center shrink-0 border border-border"
              >
                <span className="text-accent font-bold text-lg">{m.year}</span>
                <p className="text-muted-foreground text-sm mt-2">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section ref={communityAnim.ref} className="ice-blue-bg section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={communityAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="label-accent text-accent mb-3 block">Community</span>
              <h2 className="text-3xl font-bold mb-6">Building Stronger Communities</h2>
              <p className="text-body leading-relaxed mb-4">
                We partner with local organizations, healthcare providers, and community leaders to create programs that extend beyond our facilities and into the broader community.
              </p>
              <p className="text-body leading-relaxed">
                Through outreach, education, and collaborative initiatives, we're working to change how society views and supports individuals in adult foster care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={communityAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <img src={communityImg} alt="Community activities" className="aspect-[4/3] w-full object-cover rounded-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      <CTABanner title="Want to partner with us? Let's create impact together." />
    </>
  );
}
