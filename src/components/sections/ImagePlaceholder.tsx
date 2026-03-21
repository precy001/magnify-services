import { Image } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
  aspect?: string;
}

export default function ImagePlaceholder({ className = "", aspect = "aspect-video" }: ImagePlaceholderProps) {
  return (
    <div className={`bg-secondary rounded-xl flex items-center justify-center ${aspect} ${className}`}>
      <Image size={48} className="text-muted-foreground/30" />
    </div>
  );
}
