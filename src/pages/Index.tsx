import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Brain, Users, Accessibility, Play, ChevronDown, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ServiceCard from "@/components/cards/ServiceCard";
import TestimonialCard from "@/components/cards/TestimonialCard";
import StatsCounter from "@/components/sections/StatsCounter";
import CTABanner from "@/components/sections/CTABanner";
import ImagePlaceholder from "@/components/sections/ImagePlaceholder";
import heroBg from "@/assets/hero-bg.jpg";

const services = [
  { icon: Heart, title: "Developmentally Disabled Adults", description: "Personalized daily living assistance and community integration for individuals with developmental disabilities." },
  { icon: Brain, title: "Mental Health Support", description: "Therapeutic environments with medication management and emotional support programs." },
  { icon: Users, title: "Aging Adult Care", description: "Mobility support, health monitoring, companionship, and nutritional care for aging adults." },
  { icon: Accessibility, title: "Physical Disability Assistance", description: "Adaptive equipment, physical therapy coordination, and accessibility-focused living." },
];

const testimonials = [
  { quote: "Magnify Services gave my mother a second home. The caregivers treat her with such warmth and dignity — we couldn't ask for more.", name: "Adebayo Oluwa", relationship: "Son of Resident" },
  { quote: "The level of professionalism and genuine compassion at this facility is unmatched. Our family has complete peace of mind.", name: "Grace Nwachukwu", relationship: "Daughter of Resident" },
  { quote: "From the moment we walked in, we knew this was the right place. The staff goes above and beyond every single day.", name: "Samuel Okafor", relationship: "Family Member" },
  { quote: "My brother has thrived since joining Magnify Services. The personalized care plan has made a world of difference.", name: "Chioma Eze", relationship: "Sister of Resident" },
];

export default function Home() {
  const servicesAnim = useScrollAnimation();
  const missionAnim = useScrollAnimation();
  const testimonialAnim = useScrollAnimation();
  const videoAnim = useScrollAnimation();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Magnify Services care facility" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,35%,16%)] via-[hsl(213,35%,16%,0.5)] to-[hsl(213,35%,16%,0.3)]" />
        </div>
        <div className="relative container text-center z-10 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-4xl mx-auto"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Compassionate Care, Lasting Dignity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Providing specialized adult foster care for individuals who deserve comfort, respect, and a place to call home.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/consultation" className="btn-primary text-base">
              Book a Consultation
            </Link>
            <Link to="/services" className="btn-outline-white text-base">
              Learn About Our Services
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={28} className="text-white/50 animate-bounce" />
        </motion.div>
      </section>

      {/* Video Intro */}
      <section ref={videoAnim.ref} className="ice-blue-bg section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={videoAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-video bg-secondary rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer shadow-lg">
              <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play size={32} className="text-accent-foreground ml-1" />
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-6">
              Watch how Magnify Services is changing lives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section ref={servicesAnim.ref} className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label-accent text-accent mb-3 block">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive care solutions tailored to each individual's unique needs.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 0.1} inView={servicesAnim.isInView} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionAnim.ref} className="ice-blue-bg section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={missionAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <ImagePlaceholder />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={missionAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="label-accent text-accent mb-3 block">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">A Home Built on Love</h2>
              <p className="text-body leading-relaxed mb-4">
                At Magnify Services, we believe every individual deserves to live with dignity, comfort, and genuine care. Our mission is to create a nurturing environment that feels like home.
              </p>
              <p className="text-body leading-relaxed">
                We go beyond basic care to build meaningful connections, foster independence, and enrich the lives of every resident in our community.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={missionAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <span className="label-accent text-accent mb-3 block">Our Values</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Guided by Compassion</h2>
              <p className="text-body leading-relaxed mb-4">
                Transparency, accountability, and community form the foundation of everything we do. We hold ourselves to the highest standards of care.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300">
                Learn more about us <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={missionAnim.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="order-1 md:order-2"
            >
              <ImagePlaceholder />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialAnim.ref} className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label-accent text-accent mb-3 block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Families Say</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialAnim.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[380px] snap-start">
                <TestimonialCard {...t} variant={i % 2 === 0 ? "white" : "ice"} />
              </div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/testimonials" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300">
              See All Testimonials <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsCounter />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
