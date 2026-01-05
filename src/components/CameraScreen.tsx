import { motion } from "framer-motion";
import { Camera, RotateCcw, Zap, Image, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Camera as CapacitorCamera, CameraResultType, CameraSource, CameraDirection } from "@capacitor/camera";
import type { Photo, UserSettings } from "@/hooks/usePhotoStorage";
import { getEidosFilter } from "@/hooks/usePhotoStorage";

interface CameraScreenProps {
  onCapture: (photo: Omit<Photo, "id" | "timestamp">) => void;
  onGallery: () => void;
  settings: UserSettings;
  onOpenSettings: () => void;
}

const fallbackImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face";

const CameraScreen = ({ onCapture, onGallery, settings, onOpenSettings }: CameraScreenProps) => {
  const [eidosMode, setEidosMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cameraDirection, setCameraDirection] = useState<CameraDirection>(CameraDirection.Front);

  const currentImage = previewImage || fallbackImage;
  const eidosFilter = getEidosFilter(settings.archetype, settings.iterations);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    try {
      const photo = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: cameraDirection,
        correctOrientation: true,
      });

      if (photo.dataUrl) {
        setPreviewImage(photo.dataUrl);
        
        const newPhoto: Omit<Photo, "id" | "timestamp"> = {
          originalUrl: photo.dataUrl,
          archetype: settings.archetype,
          iterations: settings.iterations,
          eidosMode,
        };
        
        toast.success("Foto capturada!", {
          description: `Arquétipo: ${settings.archetype}`,
        });
        
        onCapture(newPhoto);
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Erro ao capturar foto", {
        description: "Verifique as permissões da câmera",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFlipCamera = () => {
    setCameraDirection(prev => 
      prev === CameraDirection.Front ? CameraDirection.Rear : CameraDirection.Front
    );
    toast("Câmera alternada", { icon: "🔄" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Camera viewport */}
      <div className="flex-1 relative">
        {/* Simulated camera view */}
        <motion.div
          className="absolute inset-0"
          animate={isCapturing ? { opacity: [1, 0, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <img
            src={currentImage}
            alt="Camera preview"
            className="w-full h-full object-cover"
            style={{
              filter: eidosMode ? eidosFilter : "none",
              transform: eidosMode ? "scale(1.02)" : "scale(1)",
              transition: "all 0.5s ease",
            }}
          />

          {/* Eidos mode overlay effect */}
          {eidosMode && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Subtle vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
                }}
              />
              {/* Aurora tint */}
              <div
                className="absolute inset-0 aurora-gradient opacity-5"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.div>
          )}

          {/* Flash effect */}
          {isCapturing && (
            <motion.div
              className="absolute inset-0 bg-white z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* Top controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-10"
        >
          {/* Mode indicator */}
          <div className="glass px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-foreground">
              {eidosMode ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-aurora-mid" />
                  Eidos Mode
                </span>
              ) : (
                "Original"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-3 glass rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>

            {/* Gallery button */}
            <button
              onClick={onGallery}
              className="p-3 glass rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <Image className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Archetype indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full z-10"
        >
          <span className="text-xs text-muted-foreground capitalize">
            {settings.archetype} • {settings.iterations} iterações
          </span>
        </motion.div>

        {/* Face guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-64 h-80 border-2 border-foreground/20 rounded-[40%]"
            animate={{
              borderColor: eidosMode
                ? "hsl(250 100% 65% / 0.4)"
                : "hsl(0 0% 100% / 0.2)",
            }}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-foreground/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pb-12 pt-6 px-6"
      >
        {/* Eidos toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setEidosMode(!eidosMode)}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              eidosMode
                ? "aurora-gradient text-white aurora-glow"
                : "glass text-foreground"
            }`}
          >
            {eidosMode ? "Eidos Ativo" : "Ativar Eidos"}
          </button>
        </div>

        {/* Camera controls */}
        <div className="flex items-center justify-center gap-8">
          {/* Flip camera */}
          <motion.button
            onClick={handleFlipCamera}
            className="p-4 glass rounded-full hover:bg-secondary/50 transition-colors"
            whileTap={{ scale: 0.95, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <RotateCcw className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Capture button */}
          <motion.button
            onClick={handleCapture}
            className="relative w-20 h-20"
            whileTap={{ scale: 0.95 }}
            disabled={isCapturing}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-foreground/80" />
            {/* Inner button */}
            <motion.div
              className={`absolute inset-2 rounded-full ${
                eidosMode ? "aurora-gradient" : "bg-foreground"
              }`}
              animate={isCapturing ? { scale: 0.8 } : { scale: 1 }}
            />
            <Camera className="absolute inset-0 m-auto w-8 h-8 text-white z-10" />
          </motion.button>

          {/* Placeholder for symmetry */}
          <div className="p-4 w-14 h-14" />
        </div>
      </motion.div>
    </div>
  );
};

export default CameraScreen;
