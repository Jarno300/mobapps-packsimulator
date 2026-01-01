import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface ErrorStateProps {
  message: string;
  details?: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message,
  details,
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.errorText}>{message}</ThemedText>
      {details && <ThemedText style={styles.details}>{details}</ThemedText>}
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <ThemedText>{retryLabel}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    textAlign: "center",
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
    borderRadius: 8,
  },
});
