import { Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
}

export default function ProjectCard({ title, category, description }: ProjectCardProps) {
  return (
    <div className="card-hover bg-card overflow-hidden group">
      <div className="aspect-video bg-secondary flex items-center justify-center">
        <Image size={48} className="text-muted-foreground/30" />
      </div>
      <div className="p-6">
        <span className="label-accent text-accent mb-2 block">{category}</span>
        <h3 className="font-semibold text-primary text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all duration-300"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
