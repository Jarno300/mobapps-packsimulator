import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { SpiralTransition } from "@/components/animations/spiral-transition";
import { FONTS } from "@/constants/fonts";
import {
  useGoogleAuth,
  signInWithGoogleNative,
  signInWithGoogleWeb,
  isWeb,
} from "@/services/firebase-auth";
import { useTitleScreenMusic, useBattleMusic } from "@/services/audio-service";
import { useAudio } from "@/contexts/audio-context";

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
}

export function NameInputScreen({ onSubmit }: NameInputScreenProps) {
  const [name, setName] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  const titleMusic = useTitleScreenMusic();
  const battleMusic = useBattleMusic();
  const { playMainTheme } = useAudio();

  const startMusic = () => {
    if (!musicStarted) {
      titleMusic.play();
      setMusicStarted(true);
    }
  };

  // Try to autoplay (works on native, may fail on web)
  useEffect(() => {
    if (!isWeb) {
      startMusic();
    }
    return () => {
      try {
        titleMusic.pause();
      } catch (error) {}
    };
  }, []);

  // Handle transition - stop title music, play battle music
  useEffect(() => {
    if (isTransitioning) {
      titleMusic.pause();
      battleMusic.play();
    }
  }, [isTransitioning]);

  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (!isWeb && response?.type === "success") {
      const idToken = response.authentication?.idToken as string | undefined;
      if (idToken) {
        handleNativeGoogleSignIn(idToken);
      }
    }
  }, [response]);

  const handleNativeGoogleSignIn = async (idToken: string) => {
    setIsLoading(true);
    setError(null);

    const { user, error: authError } = await signInWithGoogleNative(idToken);

    if (authError) {
      setError(authError);
      setIsLoading(false);
    } else if (user) {
      setIsTransitioning(true);
    }
  };

  const handleWebGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const { user, error: authError } = await signInWithGoogleWeb();

    if (authError) {
      setError(authError);
      setIsLoading(false);
    } else if (user) {
      setIsTransitioning(true);
    }
  };

  const handleGooglePress = () => {
    if (isWeb) {
      handleWebGoogleSignIn();
    } else {
      promptAsync();
    }
  };

  const handleGuestPlay = () => {
    if (name.trim() && !isTransitioning) {
      setIsTransitioning(true);
    }
  };

  const handleTransitionComplete = () => {
    battleMusic.fadeOut(1000, () => {
      playMainTheme();
      onSubmit(name.trim() || "Trainer");
    });
  };

  const isGuestDisabled = !name.trim() || isTransitioning || isLoading;
  const isGoogleDisabled = isLoading || (!isWeb && !request);

  return (
    <Pressable style={styles.container} onPress={startMusic}>
      <View style={styles.logoSection}>
        <Image
          source={require("@/assets/images/pokemon-text-logo.png")}
          style={styles.pokemonLogo}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/pack-opener-simulator-title.png")}
          style={styles.simulatorTitle}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formSection}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[
            styles.googleButton,
            isGoogleDisabled && styles.buttonDisabled,
          ]}
          onPress={handleGooglePress}
          disabled={isGoogleDisabled}
        >
          <Text style={styles.googleButtonText}>
            {isLoading ? "Loading..." : "Continue with Google"}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.5)"
          editable={!isTransitioning && !isLoading}
        />

        <Pressable
          style={[styles.guestButton, isGuestDisabled && styles.buttonDisabled]}
          onPress={handleGuestPlay}
          disabled={isGuestDisabled}
        >
          <Text style={styles.guestButtonText}>Play as Guest</Text>
        </Pressable>
      </View>

      <Image
        source={require("@/assets/images/Pokeball-icon.png")}
        style={styles.pokeballIcon}
        resizeMode="contain"
      />

      <SpiralTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
        color="#000"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EF4444",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
  },
  pokeballIcon: {
    width: 80,
    height: 80,
  },
  pokemonLogo: {
    width: 250,
    height: 90,
    marginBottom: 8,
  },
  simulatorTitle: {
    width: 180,
    height: 22,
  },
  formSection: {
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "#FFEB3B",
    fontSize: 12,
    fontFamily: FONTS.pokemon,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "#fff",
    padding: 16,
    fontSize: 14,
    fontFamily: FONTS.pokemon,
    color: "#fff",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "#000",
    width: "100%",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
  guestButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "#fff",
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: FONTS.pokemon,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: FONTS.pokemon,
    marginHorizontal: 12,
  },
});
