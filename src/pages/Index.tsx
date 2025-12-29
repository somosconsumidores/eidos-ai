import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScanScreen from "@/components/ScanScreen";
import CalibrationScreen from "@/components/CalibrationScreen";
import CameraScreen from "@/components/CameraScreen";
import GalleryScreen from "@/components/GalleryScreen";
import SettingsSheet from "@/components/SettingsSheet";
import { usePhotoStorage, type Photo } from "@/hooks/usePhotoStorage";
import { Toaster } from "@/components/ui/sonner";

type Screen = "scan" | "calibration" | "camera" | "gallery";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("scan");
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    photos,
    settings,
    addPhoto,
    deletePhoto,
    updateSettings,
    resetAll,
  } = usePhotoStorage();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleCapture = (photoData: Omit<Photo, "id" | "timestamp">) => {
    addPhoto(photoData);
    setCurrentScreen("gallery");
  };

  const handleCalibrationComplete = (iterations: number, archetype: "classic" | "editorial" | "natural") => {
    updateSettings({ iterations, archetype });
    setCurrentScreen("camera");
  };

  const handleReset = () => {
    resetAll();
    setCurrentScreen("scan");
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Toaster position="top-center" />
      
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
            <CalibrationScreen
              onComplete={handleCalibrationComplete}
              initialArchetype={settings.archetype}
              onOpenSettings={() => setShowSettings(true)}
            />
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
              onCapture={handleCapture}
              onGallery={() => setCurrentScreen("gallery")}
              settings={settings}
              onOpenSettings={() => setShowSettings(true)}
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
            <GalleryScreen
              onBack={() => setCurrentScreen("camera")}
              photos={photos}
              onDeletePhoto={deletePhoto}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sheet */}
      <AnimatePresence>
        {showSettings && (
          <SettingsSheet
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
