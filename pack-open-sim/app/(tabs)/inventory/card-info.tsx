import { ScrollView, StyleSheet, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { getCardCache } from "@/cache/setCardCache";

export default function CardInfoScreen() {
    const { cardId } = useLocalSearchParams<{ cardId: string }>();
    const cardList = getCardCache();
    const card = cardList.find((c) => String(c.id) === cardId);
    console.log(card)
    console.log(card?.typeLogos)
    if (card && card.typeLogos && card.rarity && card.holo !== undefined) {
        return (
            <ScrollView>

                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <ThemedText style={styles.title}>{card?.name.toUpperCase()}</ThemedText>
                        <Image source={{ uri: card?.image }} style={styles.image} />
                    </View>
                    <View style={styles.nameContainer}>
                        <ThemedText style={styles.text}>NAME:</ThemedText>
                        <ThemedText style={[styles.text, styles.name]}>{card.name.toUpperCase()}</ThemedText>
                    </View>
                    <View style={styles.typeContainer}>
                        <ThemedText style={styles.text}>TYPES: </ThemedText>
                        <View style={styles.typeImageContainer}>{typeImageGenerator(card?.typeLogos)}</View>
                    </View>
                    <View style={styles.nameContainer}>
                        <ThemedText style={styles.text}>RARITY:</ThemedText>
                        <ThemedText style={[styles.text, styles.name]}>{card.rarity.toUpperCase()}</ThemedText>
                    </View>

                    <View style={styles.holoContainer}>
                        <ThemedText style={styles.text}>HOLO:</ThemedText>
                        <View style={styles.holoImageContainer}>
                            {holoCheckImageGenerator(card.holo)}
                        </View>
                    </View>

                </View>
            </ScrollView>
        );
    }
}

function typeImageGenerator(typeImageList: ImageSourcePropType[]) {
    if (!typeImageList) { return null };

    return typeImageList.map((imageSource, index) => (

        <Image
            key={index}
            source={imageSource}
            style={styles.typeImage}
            resizeMode="contain"
        />

    ));

}

function holoCheckImageGenerator(holo: Boolean) {
    if (holo) {
        return (
            <Image
                source={require("@/assets/images/checkmark.png")}
                style={styles.holoImage}
            />
        )
    }
    return (
        <Image
            source={require("@/assets/images/cross.png")}
            style={styles.holoImage}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0,
    },

    cardContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0,
    },
    image: {
        width: 200,

        aspectRatio: 63 / 88,
        resizeMode: "contain",
        marginTop: 5,
        borderRadius: 6,
    },
    title: {
        marginTop: 15,
        fontWeight: "600",
        fontSize: 20,
    },
    text: {
        fontSize: 15,
        fontWeight: 500
    },

    typeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 200,
        marginBottom: 5,



    },

    nameContainer: {
        flexDirection: "row",
        width: 200,
        textAlign: "left",
        marginBottom: 5,




    },

    name: {
        textAlign: "center",
        width: "100%"
    },

    typeImageContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,

    },


    typeImage: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        marginBottom: -10
    },
    holoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 200,
        marginBottom: 5,



    },
    holoImageContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,

    },

    holoImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",

    }




});
