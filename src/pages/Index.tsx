import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScanScreen from "@/components/ScanScreen";
import CalibrationScreen from "@/components/CalibrationScreen";
import CameraScreen from "@/components/CameraScreen";
import GalleryScreen from "@/components/GalleryScreen";

type Screen = "scan" | "calibration" | "camera" | "gallery";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("scan");

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "scan" && (
          <motion.div
            key="scan"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ScanScreen onComplete={() => setCurrentScreen("calibration")} />
          </motion.div>
        )}

        {currentScreen === "calibration" && (
          <motion.div
            key="calibration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CalibrationScreen onComplete={() => setCurrentScreen("camera")} />
          </motion.div>
        )}

        {currentScreen === "camera" && (
          <motion.div
            key="camera"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CameraScreen
              onCapture={() => setCurrentScreen("gallery")}
              onGallery={() => setCurrentScreen("gallery")}
            />
          </motion.div>
        )}

        {currentScreen === "gallery" && (
          <motion.div
            key="gallery"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <GalleryScreen onBack={() => setCurrentScreen("camera")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;