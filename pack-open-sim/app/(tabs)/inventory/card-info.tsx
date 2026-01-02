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
    console.log(card);
    console.log(card?.image);


    return (
        <ScrollView>
            <View style={styles.container}>
                <ThemedText style={styles.title}>{card?.name}</ThemedText>
                <Image
                    source={{ uri: card?.image }}
                    style={styles.image}

                />
            </View>
        </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0



    },
    image: {
        width: 250,
        height: 344,
        resizeMode: "contain",
        marginTop: 15,
        borderRadius: 10

    },
    title: {
        marginTop: 15,
        fontWeight: 600,
        fontSize: 30

    }
});