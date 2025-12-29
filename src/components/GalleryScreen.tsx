import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowLeft, Share2, Download, Trash2 } from "lucide-react";

interface GalleryScreenProps {
  onBack: () => void;
}

const photos = [
  {
    id: 1,
    original:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    eidos:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
  },
  {
    id: 2,
    original:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
    eidos:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
  },
  {
    id: 3,
    original:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&crop=face",
    eidos:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&crop=face",
  },
];

const GalleryScreen = ({ onBack }: GalleryScreenProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSliderMove(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-4 px-6 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-secondary/50 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Galeria</h1>
        <div className="w-10" />
      </motion.header>

      {/* Main comparison view */}
      <div className="flex-1 px-6 py-4">
        <motion.div
          ref={containerRef}
          className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-ew-resize select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Eidos version (full background) */}
          <img
            src={selectedPhoto.eidos}
            alt="Eidos version"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: "brightness(1.08) contrast(1.05) saturate(1.15)",
            }}
          />

          {/* Original version (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={selectedPhoto.original}
              alt="Original version"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${100 * (100 / sliderPosition)}%` }}
            />
          </div>

          {/* Slider line */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 aurora-gradient cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%`, marginLeft: "-2px" }}
            animate={{ boxShadow: "0 0 20px hsl(250 100% 65% / 0.5)" }}
          >
            {/* Slider handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 aurora-gradient rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-white/80 rounded-full" />
                <div className="w-0.5 h-4 bg-white/80 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Labels */}
          <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full z-20">
            <span className="text-xs font-medium text-foreground">Original</span>
          </div>
          <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full z-20">
            <span className="text-xs font-medium text-gradient">Eidos</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mt-6"
        >
          <button className="p-4 glass rounded-2xl hover:bg-secondary/50 transition-colors">
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-4 glass rounded-2xl hover:bg-secondary/50 transition-colors">
            <Download className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-4 glass rounded-2xl hover:bg-destructive/20 transition-colors">
            <Trash2 className="w-5 h-5 text-destructive" />
          </button>
        </motion.div>
      </div>

      {/* Photo thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-12"
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden transition-all ${
                selectedPhoto.id === photo.id
                  ? "ring-2 ring-aurora-mid scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={photo.eidos}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.05) contrast(1.02) saturate(1.1)",
                }}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryScreen;