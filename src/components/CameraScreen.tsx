import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, RotateCcw, Zap, Image, Settings, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, CameraResultType, CameraSource, CameraDirection } from "@capacitor/camera";
import type { Photo, UserSettings } from "@/hooks/usePhotoStorage";
import { getEidosFilter } from "@/hooks/usePhotoStorage";

interface CameraScreenProps {
  onCapture: (photo: Omit<Photo, "id" | "timestamp">) => void;
  onGallery: () => void;
  settings: UserSettings;
  onOpenSettings: () => void;
}

const CameraScreen = ({ onCapture, onGallery, settings, onOpenSettings }: CameraScreenProps) => {
  const [eidosMode, setEidosMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const eidosFilter = getEidosFilter(settings.archetype, settings.iterations);

  const handleTakePhoto = async () => {
    setIsCapturing(true);

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        direction: isFrontCamera ? CameraDirection.Front : CameraDirection.Rear,
        correctOrientation: true,
        saveToGallery: false,
      });

      if (photo.base64String) {
        const imageData = `data:image/${photo.format || "jpeg"};base64,${photo.base64String}`;
        setCapturedImage(imageData);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // User cancelled - don't show error
      if (errorMessage.includes("cancelled") || errorMessage.includes("canceled")) {
        console.log("Camera cancelled by user");
      } else {
        console.error("Camera error:", error);
        toast.error("Erro ao acessar câmera", {
          description: "Verifique as permissões em Ajustes > Privacidade > Câmera",
        });
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSavePhoto = () => {
    if (!capturedImage) return;

    const newPhoto: Omit<Photo, "id" | "timestamp"> = {
      originalUrl: capturedImage,
      archetype: settings.archetype,
      iterations: settings.iterations,
      eidosMode,
    };

    toast.success("Foto salva!", {
      description: `Arquétipo: ${settings.archetype}`,
    });

    onCapture(newPhoto);
    setCapturedImage(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleFlipCamera = () => {
    setIsFrontCamera(prev => !prev);
    toast("Câmera alternada", { icon: "🔄" });
  };

  // Preview screen after capturing
  if (capturedImage) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Preview image */}
        <div className="flex-1 relative">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={capturedImage}
            alt="Foto capturada"
            className="w-full h-full object-cover"
            style={{
              filter: eidosMode ? eidosFilter : "none",
              transition: "filter 0.3s ease",
            }}
          />

          {/* Eidos overlay effect */}
          {eidosMode && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
                }}
              />
              <div
                className="absolute inset-0 aurora-gradient opacity-5"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.div>
          )}

          {/* Top controls */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-20"
          >
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
          </motion.div>

          {/* Archetype indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full z-20"
          >
            <span className="text-xs text-muted-foreground capitalize">
              {settings.archetype} • {settings.iterations} iterações
            </span>
          </motion.div>
        </div>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 pb-12 pt-6 px-6 bg-background/80 backdrop-blur-lg"
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

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-8">
            {/* Retake */}
            <motion.button
              onClick={handleRetake}
              className="p-4 glass rounded-full hover:bg-destructive/20 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6 text-destructive" />
            </motion.button>

            {/* Save */}
            <motion.button
              onClick={handleSavePhoto}
              className="relative w-20 h-20"
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-primary/80" />
              <motion.div
                className="absolute inset-2 rounded-full aurora-gradient"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Check className="absolute inset-0 m-auto w-8 h-8 text-white z-10" />
            </motion.button>

            {/* Placeholder for symmetry */}
            <div className="p-4 w-14 h-14" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Main camera screen
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Camera placeholder */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

        {/* Face guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-64 h-80 border-2 border-foreground/20 rounded-[40%]"
            animate={{
              borderColor: eidosMode
                ? "hsl(250 100% 65% / 0.4)"
                : "hsl(0 0% 100% / 0.2)",
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Center instruction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center px-8"
        >
          <CameraIcon className="w-16 h-16 text-aurora-mid mx-auto mb-4 opacity-60" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Toque para tirar selfie
          </h2>
          <p className="text-sm text-muted-foreground">
            A câmera nativa do iOS será aberta
          </p>
        </motion.div>

        {/* Top controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-20"
        >
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
            {/* Camera direction indicator */}
            <div className="glass px-3 py-1 rounded-full">
              <span className="text-xs text-muted-foreground">
                {isFrontCamera ? "Frontal" : "Traseira"}
              </span>
            </div>

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
          className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full z-20"
        >
          <span className="text-xs text-muted-foreground capitalize">
            {settings.archetype} • {settings.iterations} iterações
          </span>
        </motion.div>
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 pb-12 pt-6 px-6 bg-background/80 backdrop-blur-lg"
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
            onClick={handleTakePhoto}
            className="relative w-20 h-20"
            whileTap={{ scale: 0.95 }}
            disabled={isCapturing}
          >
            <div className="absolute inset-0 rounded-full border-4 border-foreground/80" />
            <motion.div
              className={`absolute inset-2 rounded-full ${
                eidosMode ? "aurora-gradient" : "bg-foreground"
              }`}
              animate={isCapturing ? { scale: 0.8 } : { scale: 1 }}
            />
            <CameraIcon className="absolute inset-0 m-auto w-8 h-8 text-white z-10" />
          </motion.button>

          {/* Placeholder for symmetry */}
          <div className="p-4 w-14 h-14" />
        </div>
      </motion.div>
    </div>
  );
};

export default CameraScreen;
