import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowLeft, Share2, Download, Trash2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import type { Photo } from "@/hooks/usePhotoStorage";
import { getEidosFilter } from "@/hooks/usePhotoStorage";

interface GalleryScreenProps {
  onBack: () => void;
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

const demoPhotos: Photo[] = [
  {
    id: "demo-1",
    originalUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    timestamp: Date.now() - 86400000,
    archetype: "natural",
    iterations: 3,
    eidosMode: true,
  },
  {
    id: "demo-2",
    originalUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
    timestamp: Date.now() - 172800000,
    archetype: "editorial",
    iterations: 4,
    eidosMode: true,
  },
  {
    id: "demo-3",
    originalUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&crop=face",
    timestamp: Date.now() - 259200000,
    archetype: "classic",
    iterations: 2,
    eidosMode: true,
  },
];

const GalleryScreen = ({ onBack, photos, onDeletePhoto }: GalleryScreenProps) => {
  const allPhotos = [...photos, ...demoPhotos];
  const [selectedPhoto, setSelectedPhoto] = useState(allPhotos[0]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha foto Eidos AI",
          text: "Confira minha foto com Eidos AI!",
          url: window.location.href,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the processed image
    toast.success("Download iniciado!", {
      description: "Sua foto Eidos está sendo baixada.",
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith("demo-")) {
      toast.error("Fotos de demonstração não podem ser excluídas");
      return;
    }
    
    if (deleteConfirm === id) {
      onDeletePhoto(id);
      toast.success("Foto excluída com sucesso");
      setDeleteConfirm(null);
      
      // Select next photo if available
      const remainingPhotos = allPhotos.filter((p) => p.id !== id);
      if (remainingPhotos.length > 0) {
        setSelectedPhoto(remainingPhotos[0]);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const eidosFilter = getEidosFilter(selectedPhoto.archetype, selectedPhoto.iterations);

  if (allPhotos.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
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

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="glass rounded-3xl p-8 text-center max-w-xs">
            <ImageOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma foto ainda
            </h2>
            <p className="text-sm text-muted-foreground">
              Capture sua primeira foto com Eidos para vê-la aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">Galeria</h1>
          <p className="text-xs text-muted-foreground">
            {formatDate(selectedPhoto.timestamp)}
          </p>
        </div>
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
            src={selectedPhoto.originalUrl}
            alt="Eidos version"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: eidosFilter }}
          />

          {/* Original version (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={selectedPhoto.originalUrl}
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

          {/* Archetype badge */}
          <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full z-20">
            <span className="text-xs text-muted-foreground capitalize">
              {selectedPhoto.archetype} • {selectedPhoto.iterations} iterações
            </span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mt-6"
        >
          <button
            onClick={handleShare}
            className="p-4 glass rounded-2xl hover:bg-secondary/50 transition-colors"
          >
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleDownload}
            className="p-4 glass rounded-2xl hover:bg-secondary/50 transition-colors"
          >
            <Download className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => handleDelete(selectedPhoto.id)}
            className={`p-4 glass rounded-2xl transition-colors ${
              deleteConfirm === selectedPhoto.id
                ? "bg-destructive text-destructive-foreground"
                : "hover:bg-destructive/20"
            }`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </motion.div>

        {deleteConfirm && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-destructive mt-2"
          >
            Clique novamente para confirmar exclusão
          </motion.p>
        )}
      </div>

      {/* Photo thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-12"
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <AnimatePresence>
            {allPhotos.map((photo) => (
              <motion.button
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedPhoto(photo)}
                className={`flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden transition-all ${
                  selectedPhoto.id === photo.id
                    ? "ring-2 ring-aurora-mid scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo.originalUrl}
                  alt={`Photo from ${formatDate(photo.timestamp)}`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: getEidosFilter(photo.archetype, photo.iterations),
                  }}
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryScreen;
