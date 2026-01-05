import { useState } from "react";
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

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
}

export function NameInputScreen({ onSubmit }: NameInputScreenProps) {
  const [name, setName] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSubmit = () => {
    if (name.trim() && !isTransitioning) {
      setIsTransitioning(true);
    }
  };

  const handleTransitionComplete = () => {
    onSubmit(name.trim());
  };

  const isDisabled = !name.trim() || isTransitioning;

  return (
    <View style={styles.container}>
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
        <Text style={styles.label}>Your name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.5)"
          autoFocus
          editable={!isTransitioning}
        />
        <Pressable
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>
            {isTransitioning ? "..." : "Start"}
          </Text>
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
    </View>
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
    width: 100,
    height: 100,
  },
  pokemonLogo: {
    width: 280,
    height: 100,
    marginBottom: 8,
  },
  simulatorTitle: {
    width: 200,
    height: 24,
  },
  formSection: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 24,
    fontFamily: FONTS.pokemon,
    color: "#fff",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "#fff",
    padding: 18,
    fontSize: 16,
    fontFamily: FONTS.pokemon,
    color: "#fff",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "#000",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#EF4444",
    fontSize: 16,
    fontFamily: FONTS.pokemon,
  },
});
