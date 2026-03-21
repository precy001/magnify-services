import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  inView?: boolean;
}

export default function ServiceCard({ icon: Icon, title, description, delay = 0, inView = true }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card p-8 card-hover group"
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors duration-300">
        <Icon size={24} className="text-accent" />
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">{description}</p>
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all duration-300"
      >
        Learn More <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
