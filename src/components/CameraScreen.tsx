import { motion } from "framer-motion";
import { Camera, RotateCcw, Zap, Image } from "lucide-react";
import { useState } from "react";

interface CameraScreenProps {
  onCapture: () => void;
  onGallery: () => void;
}

const CameraScreen = ({ onCapture, onGallery }: CameraScreenProps) => {
  const [eidosMode, setEidosMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onCapture();
    }, 500);
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
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face"
            alt="Camera preview"
            className="w-full h-full object-cover"
            style={{
              filter: eidosMode
                ? "brightness(1.05) contrast(1.05) saturate(1.1)"
                : "none",
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

          {/* Gallery button */}
          <button
            onClick={onGallery}
            className="p-3 glass rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <Image className="w-5 h-5 text-foreground" />
          </button>
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
          <button className="p-4 glass rounded-full hover:bg-secondary/50 transition-colors">
            <RotateCcw className="w-6 h-6 text-foreground" />
          </button>

          {/* Capture button */}
          <motion.button
            onClick={handleCapture}
            className="relative w-20 h-20"
            whileTap={{ scale: 0.95 }}
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