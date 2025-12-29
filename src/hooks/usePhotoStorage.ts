import { useState, useEffect, useCallback } from "react";

export interface Photo {
  id: string;
  originalUrl: string;
  timestamp: number;
  archetype: "classic" | "editorial" | "natural";
  iterations: number;
  eidosMode: boolean;
}

export interface UserSettings {
  archetype: "classic" | "editorial" | "natural";
  iterations: number;
  hasCompletedOnboarding: boolean;
}

const PHOTOS_KEY = "eidos_photos";
const SETTINGS_KEY = "eidos_settings";

const defaultSettings: UserSettings = {
  archetype: "natural",
  iterations: 0,
  hasCompletedOnboarding: false,
};

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPhotos = localStorage.getItem(PHOTOS_KEY);
      const storedSettings = localStorage.getItem(SETTINGS_KEY);

      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }

      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save photos to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
    }
  }, [photos, isLoaded]);

  // Save settings to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const addPhoto = useCallback((photo: Omit<Photo, "id" | "timestamp">) => {
    const newPhoto: Photo = {
      ...photo,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    return newPhoto;
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setSettings((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const resetAll = useCallback(() => {
    setPhotos([]);
    setSettings(defaultSettings);
    localStorage.removeItem(PHOTOS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }, []);

  return {
    photos,
    settings,
    isLoaded,
    addPhoto,
    deletePhoto,
    updateSettings,
    completeOnboarding,
    resetAll,
  };
};

// Filter string generator based on settings
export const getEidosFilter = (
  archetype: "classic" | "editorial" | "natural",
  iterations: number
): string => {
  const brightness = 1 + iterations * 0.03;
  const contrast = 1 + iterations * 0.02;
  const saturate = 1 + iterations * 0.05;

  switch (archetype) {
    case "classic":
      return `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${iterations * 0.05})`;
    case "editorial":
      return `brightness(${brightness}) contrast(${1 + iterations * 0.04}) saturate(${0.9 + iterations * 0.02})`;
    default:
      return `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
  }
};
