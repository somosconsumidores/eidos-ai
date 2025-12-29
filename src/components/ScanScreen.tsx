import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Scan, ChevronRight } from "lucide-react";

interface ScanScreenProps {
  onComplete: () => void;
}

const instructions = [
  "Posicione seu rosto no centro",
  "Analisando estrutura facial...",
  "Inclinando para a esquerda...",
  "Capturando ângulo da mandíbula...",
  "Mapeando proporções áureas...",
  "Calibração concluída",
];

const ScanScreen = ({ onComplete }: ScanScreenProps) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * (instructions.length - 1));
    setStep(Math.min(stepIndex, instructions.length - 1));
  }, [progress]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background aurora effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full aurora-gradient opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 left-0 right-0 text-center"
      >
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          EIDOS<span className="text-gradient">AI</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Batismo Digital</p>
      </motion.div>

      {/* Scan Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full scan-ring"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ opacity: isComplete ? 0 : 0.8 }}
        />

        {/* Inner glow ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-aurora-mid/30"
          animate={{
            boxShadow: isComplete
              ? "0 0 60px hsl(250 100% 65% / 0.6)"
              : [
                  "0 0 20px hsl(250 100% 65% / 0.2)",
                  "0 0 40px hsl(250 100% 65% / 0.4)",
                  "0 0 20px hsl(250 100% 65% / 0.2)",
                ],
          }}
          transition={{
            duration: 2,
            repeat: isComplete ? 0 : Infinity,
          }}
        />

        {/* Scan lines container */}
        <div className="absolute inset-8 rounded-full overflow-hidden">
          {!isComplete && (
            <>
              <motion.div
                className="absolute inset-x-0 h-px aurora-gradient"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-y-0 w-px aurora-gradient"
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </>
          )}
        </div>

        {/* Center face placeholder */}
        <motion.div
          className="w-40 h-40 rounded-full glass flex items-center justify-center"
          animate={
            isComplete
              ? { scale: 1.05 }
              : { scale: [1, 1.02, 1] }
          }
          transition={{
            duration: 2,
            repeat: isComplete ? 0 : Infinity,
          }}
        >
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full aurora-gradient flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          ) : (
            <Scan className="w-12 h-12 text-muted-foreground animate-pulse-glow" />
          )}
        </motion.div>

        {/* Corner markers */}
        {[0, 90, 180, 270].map((rotation) => (
          <motion.div
            key={rotation}
            className="absolute w-6 h-6"
            style={{
              transform: `rotate(${rotation}deg) translateY(-140px)`,
            }}
            animate={{
              opacity: isComplete ? 1 : [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: isComplete ? 0 : Infinity,
              delay: rotation / 360,
            }}
          >
            <div className="w-full h-0.5 aurora-gradient rounded-full" />
            <div className="w-0.5 h-4 aurora-gradient rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-12 h-16 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-foreground text-lg font-medium text-center"
          >
            {instructions[step]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-secondary rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full aurora-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Continue button */}
      <AnimatePresence>
        {isComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={onComplete}
            className="absolute bottom-16 px-8 py-4 glass rounded-full flex items-center gap-3 hover:bg-secondary/50 transition-colors group"
          >
            <span className="text-foreground font-medium">
              Iniciar Calibração
            </span>
            <ChevronRight className="w-5 h-5 text-aurora-mid group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanScreen;