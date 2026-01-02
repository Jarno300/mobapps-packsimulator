import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
}

export function NameInputScreen({ onSubmit }: NameInputScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const isDisabled = !name.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="rgba(255,255,255,0.5)"
        autoFocus
      />
      <Pressable
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  label: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    color: "#fff",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "700",
  },
});
