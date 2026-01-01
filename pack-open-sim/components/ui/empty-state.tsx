import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface EmptyStateProps {
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  message,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {onAction && actionLabel && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <ThemedText>{actionLabel}</ThemedText>
        </TouchableOpacity>
      )}
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
  message: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
    borderRadius: 8,
  },
});
