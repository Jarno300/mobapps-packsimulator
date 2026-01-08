import { createContext, useContext, ReactNode } from "react";
import { useAudioPlayer } from "expo-audio";
import { AUDIO_TRACKS, fadeOutAudio } from "@/services/audio-service";

interface AudioContextValue {
  playMainTheme: () => void;
  stopMainTheme: () => void;
  fadeOutMainTheme: (duration?: number, onComplete?: () => void) => void;
  setVolumeForMainTheme: (volume: number) => void;
  mainThemeVolume: number;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const mainThemePlayer = useAudioPlayer(AUDIO_TRACKS.mainTheme);
  let mainThemeVolume = 0.3;

  const playMainTheme = () => {
    mainThemePlayer.loop = true;
    mainThemePlayer.volume = mainThemeVolume;
    mainThemePlayer.play();
  };

  const stopMainTheme = () => {
    mainThemePlayer.pause();
  };

  const fadeOutMainTheme = (duration?: number, onComplete?: () => void) => {
    fadeOutAudio(mainThemePlayer, duration, onComplete);
  };

  const setVolumeForMainTheme = (volume: number) => {
    mainThemeVolume = volume;
    mainThemePlayer.volume = volume;
  };

  return (
    <AudioContext.Provider
      value={{
        playMainTheme,
        stopMainTheme,
        fadeOutMainTheme,
        setVolumeForMainTheme,
        mainThemeVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
