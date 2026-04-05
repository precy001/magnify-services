import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import { Image, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import facilityImg1 from "@/assets/gallery/facility-1.jpeg";

const filters = ["All", "Facility", "Activities", "Events", "Programs"];

interface GalleryItem {
  id: number;
  category: string;
  type: "image" | "video";
  src?: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, category: "Facility", type: "image", src: facilityImg1 },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 2,
    category: filters[1 + ((i + 1) % 4)],
    type: (i + 1 === 2 || i + 1 === 7 ? "video" : "image") as "image" | "video",
  })),
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gridAnim = useScrollAnimation();

  const filtered = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);
  const images = filtered.filter((g) => g.type === "image");
  const videos = filtered.filter((g) => g.type === "video");

  const currentIndex = lightbox !== null ? images.findIndex((img) => img.id === lightbox) : -1;

  const navigate = (dir: 1 | -1) => {
    if (currentIndex < 0) return;
    const next = (currentIndex + dir + images.length) % images.length;
    setLightbox(images[next].id);
  };

  return (
    <>
      <SectionHero
        title="Our Gallery"
        subtitle="A glimpse into life at Magnify Services."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }]}
      />

      <section ref={gridAnim.ref} className="section-padding">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === f ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16"
          >
            {images.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={gridAnim.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setLightbox(item.id)}
                className="aspect-square bg-secondary rounded-xl flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
              >
                {item.src ? (
                  <img src={item.src} alt={`Gallery ${item.category}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Image size={32} className="text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300" />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Videos */}
          {videos.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-6">Videos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((v) => (
                  <div key={v.id} className="aspect-video bg-secondary rounded-xl flex items-center justify-center cursor-pointer group relative">
                    <div className="w-14 h-14 rounded-full bg-accent/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play size={24} className="text-accent-foreground ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              aria-label="Previous"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-[4/3] bg-secondary rounded-2xl flex items-center justify-center overflow-hidden"
            >
              {images[currentIndex]?.src ? (
                <img src={images[currentIndex].src} alt="Gallery" className="w-full h-full object-cover" />
              ) : (
                <Image size={64} className="text-muted-foreground/30" />
              )}
            </motion.div>
            <button
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              aria-label="Next"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
