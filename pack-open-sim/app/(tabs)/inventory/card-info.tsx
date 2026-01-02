import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";




export default function CardInfoScreen() {
    const { cardId } = useLocalSearchParams<{ cardId: string }>();
    const cardList = getCardCache();
    const card = cardList.find((card) => String(card.id) === cardId);


    return (
        <View>
            <ThemedText>{card?.name}</ThemedText>
            <Image
                source={{ uri: card?.image }}

            />
        </View>)
}