import { ScrollView, StyleSheet, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { getCardCache } from "@/cache/setCardCache";

export default function CardInfoScreen() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const cardList = getCardCache();
  const card = cardList.find((c) => String(c.id) === cardId);

  return (
    <ScrollView>
      <View style={styles.container}>
        <ThemedText style={styles.title}>{card?.name}</ThemedText>
        <Image source={{ uri: card?.image }} style={styles.image} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
  },
  image: {
    width: 150,
    height: 206,
    resizeMode: "contain",
    marginTop: 5,
    borderRadius: 6,
  },
  title: {
    marginTop: 15,
    fontWeight: "600",
    fontSize: 20,
  },
});
