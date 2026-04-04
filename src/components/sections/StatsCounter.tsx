import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

const stats = [
  { value: 18, suffix: "+", label: "Residents Cared For" },
  { value: 2, suffix: "+", label: "Years of Service" },
  { value: 13, suffix: "+", label: "Trained Caregivers" },
  { value: 100, suffix: "%", label: "Family Satisfaction Rate" },
];

function StatItem({ value, suffix, label, inView, delay }: {
  value: number; suffix: string; label: string; inView: boolean; delay: number;
}) {
  const count = useCountUp(value, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

export default function StatsCounter() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section ref={ref} className="ice-blue-bg section-padding">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} inView={isInView} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
