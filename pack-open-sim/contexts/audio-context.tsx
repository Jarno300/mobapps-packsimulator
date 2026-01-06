import { createContext, useContext, ReactNode } from "react";
import { useAudioPlayer } from "expo-audio";
import { AUDIO_TRACKS, fadeOutAudio } from "@/services/audio-service";

interface AudioContextValue {
  playMainTheme: () => void;
  stopMainTheme: () => void;
  fadeOutMainTheme: (duration?: number, onComplete?: () => void) => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const mainThemePlayer = useAudioPlayer(AUDIO_TRACKS.mainTheme);

  const playMainTheme = () => {
    mainThemePlayer.loop = true;
    mainThemePlayer.volume = 0.3;
    mainThemePlayer.play();
  };

  const stopMainTheme = () => {
    mainThemePlayer.pause();
  };

  const fadeOutMainTheme = (duration?: number, onComplete?: () => void) => {
    fadeOutAudio(mainThemePlayer, duration, onComplete);
  };

  return (
    <AudioContext.Provider
      value={{ playMainTheme, stopMainTheme, fadeOutMainTheme }}
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

export function setVolumeForMainTheme(volume: number) {
  const mainThemePlayer = useAudioPlayer(AUDIO_TRACKS.mainTheme);
  mainThemePlayer.volume = volume;
}
