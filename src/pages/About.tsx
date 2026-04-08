import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import ImagePlaceholder from "@/components/sections/ImagePlaceholder";
import CTABanner from "@/components/sections/CTABanner";
import { CheckCircle, Heart, Shield, Eye, Users, Award, Star } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion", desc: "Every interaction is guided by empathy and genuine care for each individual." },
  { icon: Shield, title: "Dignity", desc: "We uphold the inherent worth and rights of every person we serve." },
  { icon: Eye, title: "Transparency", desc: "Open communication with families about care plans, progress, and challenges." },
  { icon: Users, title: "Community", desc: "Building meaningful connections that enrich the lives of residents and staff." },
  { icon: Award, title: "Excellence", desc: "Continuous improvement in care quality, training, and facility standards." },
  { icon: Star, title: "Accountability", desc: "Taking responsibility for outcomes and maintaining the highest ethical standards." },
];

const objectives = [
  "Provide personalized, high-quality care tailored to individual needs",
  "Create a safe, nurturing environment that feels like home",
  "Empower residents to maintain maximum independence",
  "Support families with transparent communication and involvement",
  "Train and develop compassionate care professionals",
  "Contribute positively to the broader community",
];

const milestones = [
  { year: "2004", title: "Founded", desc: "{ year: "2004", title: "Founded", desc: "Magnify Services Inc was established with a vision to transform adult foster care." }, with a vision to transform adult foster care." },
  { year: "2013", title: "First Expansion", desc: "Opened our second care facility to serve more individuals in need." },
  { year: "2016", title: "Mental Health Program", desc: "Launched specialized care programs for individuals with mental health challenges." },
  { year: "2019", title: "50+ Staff", desc: "Grew our team of trained caregivers to over 50 dedicated professionals." },
  { year: "2022", title: "Community Award", desc: "Recognized for outstanding community service and care excellence." },
  { year: "2025", title: "500+ Served", desc: "Reached the milestone of caring for over 500 residents since founding." },
];

export default function About() {
  const storyAnim = useScrollAnimation();
  const missionAnim = useScrollAnimation();
  const valuesAnim = useScrollAnimation();
  const timelineAnim = useScrollAnimation();

  return (
    <>
      <SectionHero
        title="Our Story"
        subtitle="Built on compassion. Driven by dignity."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
      />

      {/* Story */}
      <section ref={storyAnim.ref} className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={storyAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="label-accent text-accent mb-3 block">Background</span>
              <h2 className="text-3xl font-bold mb-6">How We Began</h2>
              <div className="space-y-4 text-body leading-relaxed">
                <p>This organization was established in February 2004 to provide Adult Foster Care services to the less privileged and those in need of help in and around the Lansing community of Michigan. We started with a single facility and a small, dedicated team of caregivers, united by one simple philosophy: treat every resident the way we would want our own family members to be treated.</p>
                <p>Over the years, we have grown into a trusted name in adult foster care, serving hundreds of individuals across multiple specialized programs. Despite our growth, our core values remain unchanged — compassion, dignity, and an unwavering commitment to excellence. Every decision we make, every service we offer, is guided by the same principle that inspired our founding: to make a meaningful difference in the lives of those we serve.</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={storyAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-6"
            >
              <ImagePlaceholder aspect="aspect-[4/3]" />
              <ImagePlaceholder aspect="aspect-[4/3]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Objectives */}
      <section ref={missionAnim.ref} className="ice-blue-bg section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={missionAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="label-accent text-accent mb-3 block">Our Mission</span>
            <h2 className="text-3xl font-bold mb-8">Mission & Objectives</h2>
            <blockquote className="border-l-4 border-accent bg-card rounded-r-2xl p-8 mb-10 shadow-sm">
              <p className="text-lg text-primary font-medium italic leading-relaxed">
                "To deliver structured, person-centered adult foster care services that promote safety, stability, and improved quality of life. Magnify Services is committed to upholding the highest standards of care through professional excellence, accountability, and continuous support tailored to the unique needs of each individual."
              </p>
            </blockquote>
            <h3 className="text-xl font-semibold mb-6">Our Objectives</h3>
            <ul className="space-y-4">
              {objectives.map((obj, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={missionAnim.isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-body">{obj}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesAnim.ref} className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label-accent text-accent mb-3 block">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                animate={valuesAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-card p-8 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-5">
                  <v.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineAnim.ref} className="ice-blue-bg section-padding">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={timelineAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label-accent text-accent mb-3 block">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold">Key Milestones</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                animate={timelineAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex gap-8 mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="hidden md:block w-1/2" />
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-accent -translate-x-1.5 mt-2" />
                <div className="ml-14 md:ml-0 md:w-1/2 bg-card p-6 rounded-2xl shadow-sm">
                  <span className="text-accent font-bold text-sm">{m.year}</span>
                  <h4 className="font-semibold text-primary mt-1">{m.title}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Join us in our mission to provide compassionate care" />
    </>
  );
}
