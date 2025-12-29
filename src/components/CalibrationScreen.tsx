import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RefreshCw, Check, Sparkles, Sliders } from "lucide-react";

interface CalibrationScreenProps {
  onComplete: (iterations: number, archetype: "classic" | "editorial" | "natural") => void;
  initialArchetype?: "classic" | "editorial" | "natural";
  onOpenSettings: () => void;
}

const archetypes = [
  { id: "classic" as const, label: "Clássico", description: "Proporções áureas tradicionais" },
  { id: "editorial" as const, label: "Editorial", description: "Look de alta moda" },
  { id: "natural" as const, label: "Natural", description: "Realce sutil e orgânico" },
];

const CalibrationScreen = ({ onComplete, initialArchetype = "natural", onOpenSettings }: CalibrationScreenProps) => {
  const [iterations, setIterations] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<"classic" | "editorial" | "natural">(initialArchetype);
  const [showLocalSettings, setShowLocalSettings] = useState(false);

  const handleUpdate = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIterations((prev) => prev + 1);
      setIsProcessing(false);
    }, 1200);
  };

  const getFilterString = () => {
    const brightness = 1 + iterations * 0.03;
    const contrast = 1 + iterations * 0.02;
    const saturate = 1 + iterations * 0.05;

    switch (selectedArchetype) {
      case "classic":
        return `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${iterations * 0.05})`;
      case "editorial":
        return `brightness(${brightness}) contrast(${1 + iterations * 0.04}) saturate(${0.9 + iterations * 0.02})`;
      default:
        return `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
    }
  };

  const filterString = getFilterString();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full aurora-gradient opacity-5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-12 pb-6 px-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Bio-Template
          </h1>
          <p className="text-sm text-muted-foreground">
            Iteração #{iterations}
          </p>
        </div>
        <button
          onClick={() => setShowLocalSettings(!showLocalSettings)}
          className="p-3 glass rounded-xl hover:bg-secondary/50 transition-colors"
        >
          <Sliders className="w-5 h-5 text-muted-foreground" />
        </button>
      </motion.header>

      {/* Settings panel */}
      <AnimatePresence>
        {showLocalSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 px-6 overflow-hidden"
          >
            <div className="glass rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-3">
                Arquétipo de Beleza
              </p>
              <div className="space-y-2">
                {archetypes.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArchetype(arch.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      selectedArchetype === arch.id
                        ? "aurora-gradient text-white"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="font-medium">{arch.label}</span>
                    <span className="block text-xs opacity-70 mt-0.5">
                      {arch.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <motion.div
          className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Glass frame */}
          <div className="absolute inset-0 glass rounded-3xl z-10 pointer-events-none" />

          {/* Image */}
          <motion.img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face"
            alt="Portrait for calibration"
            className="w-full h-full object-cover"
            style={{ filter: filterString }}
            animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.6 }}
          />

          {/* Processing overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-aurora-mid" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Aurora glow effect when processing */}
          {isProcessing && (
            <motion.div
              className="absolute inset-0 aurora-gradient opacity-20 z-15"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.2 }}
            />
          )}
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < iterations ? "w-8 aurora-gradient" : "w-1.5 bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 pb-12 space-y-3"
      >
        {/* Update button */}
        <motion.button
          onClick={handleUpdate}
          disabled={isProcessing}
          className="w-full py-5 aurora-gradient rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 aurora-glow"
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw
            className={`w-5 h-5 text-white ${isProcessing ? "animate-spin" : ""}`}
          />
          <span className="text-white font-semibold text-lg">
            Atualizar Padrão
          </span>
        </motion.button>

        {/* Fix template button */}
        {iterations >= 3 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onComplete(iterations, selectedArchetype)}
            className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-3 hover:bg-secondary/50 transition-colors"
          >
            <Check className="w-5 h-5 text-aurora-mid" />
            <span className="text-foreground font-medium">
              Fixar meu Bio-Template
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default CalibrationScreen;
