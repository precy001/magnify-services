import { Image } from "lucide-react";

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  tag?: string;
}

export default function TeamCard({ name, role, bio, tag }: TeamCardProps) {
  return (
    <div className="group card-hover bg-card overflow-hidden">
      <div className="aspect-square bg-secondary flex items-center justify-center">
        <Image size={48} className="text-muted-foreground/30" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-primary mb-1">{name}</h3>
        <p className="text-accent text-sm font-medium mb-2">{role}</p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{bio}</p>
        {tag && (
          <span className="label-accent text-accent">{tag}</span>
        )}
      </div>
    </div>
  );
}
