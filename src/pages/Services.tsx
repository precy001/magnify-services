import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import ImagePlaceholder from "@/components/sections/ImagePlaceholder";
import CTABanner from "@/components/sections/CTABanner";
import { SERVICES } from "@/lib/constants";


export default function Services() {
  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="Personalized care plans for every individual."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]}
      />

      {SERVICES.map((service, i) => {
        const ServiceSection = () => {
          const anim = useScrollAnimation();
          const isEven = i % 2 === 0;
          return (
            <section
              ref={anim.ref}
              key={service.id}
              className={`section-padding ${i % 2 === 1 ? "ice-blue-bg" : ""}`}
            >
              <div className="container">
                <div className={`grid md:grid-cols-2 gap-16 items-center ${!isEven ? "md:direction-rtl" : ""}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                    animate={anim.isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className={!isEven ? "md:order-2" : ""}
                  >
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="aspect-[4/3] w-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImagePlaceholder aspect="aspect-[4/3]" />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 24 : -24 }}
                    animate={anim.isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={!isEven ? "md:order-1" : ""}
                  >
                    <span className="label-accent text-accent mb-3 block">Service {String(i + 1).padStart(2, "0")}</span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-body leading-relaxed mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-body text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/consultation" className="btn-primary">
                      Book a Consultation
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        };
        return <ServiceSection key={service.id} />;
      })}

      <CTABanner
        title="Not sure which service fits? Let's talk."
        primaryLabel="Book a Consultation"
        primaryHref="/consultation"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
