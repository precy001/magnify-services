import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHero from "@/components/sections/SectionHero";
import { Image, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import facilityImg1 from "@/assets/gallery/facility-1.jpeg";
import facilityImg2 from "@/assets/gallery/3e1e6e62-c53a-4c6c-9ac5-9f848afd7131.jpeg";
import facilityImg3 from "@/assets/gallery/6d9608b0-5bd7-4ca7-a9b1-eff7e7bb0336.jpeg";
import facilityImg4 from "@/assets/gallery/6f138269-25b4-4a8e-b3c8-0b301c8b7707.jpeg";
import facilityImg5 from "@/assets/gallery/7efc3d4a-d7e0-4f7d-92bc-d71f11f871d1.jpeg";
import facilityImg6 from "@/assets/gallery/33cc7e69-eaef-4ff4-a77b-9cf49df46a0f.jpeg";
import facilityImg7 from "@/assets/gallery/51b0d65c-6883-48d6-a910-b1f740a32750.jpeg";
import facilityImg8 from "@/assets/gallery/518fe9f5-9712-4232-bf28-ef8acfdfe21d.jpeg";
import facilityImg9 from "@/assets/gallery/2317be5c-951f-47a0-ba09-56778e5796c3.jpeg";
import facilityImg10 from "@/assets/gallery/6594e16e-8d76-4569-b83c-f3b3a28508e3.jpeg";
import facilityImg11 from "@/assets/gallery/b7e273dd-04ad-4bc3-a890-2f3184066043.jpeg";
import facilityImg12 from "@/assets/gallery/b36c149a-289c-4db1-8f0e-7a876173a731.jpeg";
import facilityImg13 from "@/assets/gallery/cf9dcbeb-ee22-4d1a-968c-c44cbce545fa.jpeg";
import facilityImg14 from "@/assets/gallery/f57a0278-337e-4b53-923d-47b807d6f5c1.jpeg";

const filters = ["All", "Facility", "Activities", "Events", "Programs"];

interface GalleryItem {
  id: number;
  category: string;
  type: "image" | "video";
  src?: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, category: "Facility", type: "image", src: facilityImg1 },
  { id: 1, category: "Facility", type: "image", src: facilityImg2 },
  { id: 1, category: "Facility", type: "image", src: facilityImg3 },
  { id: 1, category: "Facility", type: "image", src: facilityImg4 },
  { id: 1, category: "Facility", type: "image", src: facilityImg5 },
  { id: 1, category: "Facility", type: "image", src: facilityImg6 },
  { id: 1, category: "Facility", type: "image", src: facilityImg7 },
  { id: 1, category: "Facility", type: "image", src: facilityImg8 },
  { id: 1, category: "Facility", type: "image", src: facilityImg9 },
  { id: 1, category: "Facility", type: "image", src: facilityImg10 },
  { id: 1, category: "Facility", type: "image", src: facilityImg11},
  { id: 1, category: "Facility", type: "image", src: facilityImg12 },
  { id: 1, category: "Facility", type: "image", src: facilityImg13 },
  { id: 1, category: "Facility", type: "image", src: facilityImg14},
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
