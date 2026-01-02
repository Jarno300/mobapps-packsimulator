import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Pressable,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/api/fetchCards";

export interface CardInfoProps {
    card: Card;
}


export function CardInfo({ card }: CardInfoProps) {
    return (
        <View>
            <ThemedText>hallo</ThemedText>
        </View>)
}