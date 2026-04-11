import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  relationship: string;
  variant?: "white" | "ice";
}

export default function TestimonialCard({ quote, name, relationship, variant = "white" }: TestimonialCardProps) {
  return (
    <div className={`p-8 rounded-lg border border-border ${variant === "ice" ? "ice-blue-bg" : "bg-card"}`}>
      <Quote size={28} className="text-accent/40 mb-4" />
      <p className="italic text-body leading-relaxed mb-6">{quote}</p>
      <div>
        <p className="font-semibold text-primary text-sm">{name}</p>
        <p className="text-muted-foreground text-xs">{relationship}</p>
      </div>
    </div>
  );
}
