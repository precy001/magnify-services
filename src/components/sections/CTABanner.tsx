import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CTABannerProps {
  title?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  title = "Ready to Find the Right Care for Your Loved One?",
  primaryLabel = "Book a Visit",
  primaryHref = "/consultation",
  secondaryLabel = "Make a Donation",
  secondaryHref = "/donate",
}: CTABannerProps) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section ref={ref} className="navy-bg section-padding">
      <div className="container text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 max-w-2xl mx-auto leading-tight"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          <Link to={secondaryHref} className="btn-outline-white">
            {secondaryLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
