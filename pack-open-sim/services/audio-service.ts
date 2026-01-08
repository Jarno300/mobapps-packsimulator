import { useAudioPlayer, AudioPlayer } from "expo-audio";

export const AUDIO_TRACKS = {
  titleScreen: require("@/assets/sounds/title-screen.mp3"),
  battle: require("@/assets/sounds/battle.mp3"),
  mainTheme: require("@/assets/sounds/main-theme-sound.mp3"),
};

export function fadeOutAudio(
  player: AudioPlayer,
  duration: number = 1000,
  onComplete?: () => void
) {
  const fadeSteps = 20;
  const stepDuration = duration / fadeSteps;
  const initialVolume = player.volume || 0.2;
  const volumeStep = initialVolume / fadeSteps;
  let currentVolume = initialVolume;

  const fadeInterval = setInterval(() => {
    currentVolume -= volumeStep;
    if (currentVolume <= 0) {
      clearInterval(fadeInterval);
      player.pause();
      player.volume = initialVolume;
      onComplete?.();
    } else {
      player.volume = currentVolume;
    }
  }, stepDuration);

  return () => clearInterval(fadeInterval);
}

export function useTitleScreenMusic() {
  const player = useAudioPlayer(AUDIO_TRACKS.titleScreen);

  const play = () => {
    player.loop = true;
    player.volume = 0.2;
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const fadeOut = (duration?: number, onComplete?: () => void) => {
    return fadeOutAudio(player, duration, onComplete);
  };

  return { player, play, pause, fadeOut };
}

export function useBattleMusic() {
  const player = useAudioPlayer(AUDIO_TRACKS.battle);

  const play = () => {
    player.volume = 0.2;
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const fadeOut = (duration?: number, onComplete?: () => void) => {
    return fadeOutAudio(player, duration, onComplete);
  };

  return { player, play, pause, fadeOut };
}
