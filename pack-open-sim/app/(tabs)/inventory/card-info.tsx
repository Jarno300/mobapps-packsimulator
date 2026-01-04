import { ScrollView, StyleSheet, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ImageSourcePropType } from "react-native";
import { FONTS } from "@/constants/fonts";

import { ThemedText } from "@/components/themed-text";
import { getCardCache } from "@/cache/setCardCache";



export default function CardInfoScreen() {
    const { cardId } = useLocalSearchParams<{ cardId: string }>();
    const cardList = getCardCache();
    const card = cardList.find((c) => String(c.id) === cardId);
    if (!card || !card.typeLogos || !card.rarity || card.holo === undefined) {
        return (
            <View style={styles.container}>
                <ThemedText>Card not found</ThemedText>
            </View>
        );
    }
    return (
        <ScrollView>

            <View style={styles.container}>
                <View style={styles.cardContainer}>
                    <Image source={{ uri: card?.image }} style={styles.image} />
                </View>
                <View style={{ width: '100%' }}>
                    <View style={styles.dynamicContentContainer}>
                        <ThemedText style={[styles.text, styles.staticContent]}>NAME:</ThemedText>
                        {nameLengthChecker(card.name)}
                    </View>
                    <View style={styles.typeContainer}>
                        <ThemedText style={[styles.text, styles.staticContent]}>TYPES: </ThemedText>
                        <View style={styles.typeImageContainer}>{typeImageGenerator(card?.typeLogos)}</View>
                    </View>
                    <View style={styles.dynamicContentContainer}>
                        <ThemedText style={[styles.text, styles.staticContent]}>RARITY:</ThemedText>
                        <ThemedText style={[styles.text, styles.dynamicContent]}>{card.rarity.toUpperCase()}</ThemedText>
                    </View>

                    <View style={styles.holoContainer}>
                        <ThemedText style={[styles.text, styles.staticContent]}>HOLO:</ThemedText>
                        <View style={styles.holoImageContainer}>
                            {holoCheckImageGenerator(card.holo)}
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}

function typeImageGenerator(typeImageList: ImageSourcePropType[]) {


    if (typeImageList.length === 0) {
        return (
            <ThemedText style={[styles.text, styles.dynamicContent]}>NONE</ThemedText>
        )

    };

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
                source={require("../../../assets/images/checkmark.png")}
                style={styles.holoImage}
            />
        )
    }
    return (
        <Image
            source={require("../../../assets/images/cross.png")}
            style={styles.holoImage}
        />
    )
}

function nameLengthChecker(name: string) {
    if (name.length >= 17) {
        return (
            <ThemedText style={[styles.smallText, styles.dynamicContent]}>{name.toUpperCase()}</ThemedText>
        )
    }
    return (<ThemedText style={[styles.text, styles.dynamicContent]}>{name.toUpperCase()}</ThemedText>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        fontFamily: FONTS.pokemon,
        paddingLeft: 10,
        paddingRight: 10,

    },

    cardContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 280,
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
        fontWeight: "500",
        alignSelf: "center",
        fontFamily: FONTS.pokemon
    },
    smallText: {
        fontSize: 11,
        fontWeight: "500",
        alignSelf: "center",
        fontFamily: FONTS.pokemon
    },



    typeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,




    },

    dynamicContentContainer: {
        flexDirection: "row",
        textAlign: "left",
        marginBottom: 5,




    },

    dynamicContent: {

        textAlign: "center",
        width: "70%"
    },

    staticContent: {
        width: "30%"
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
        marginBottom: 5,
        height: 30



    },
    holoImageContainer: {
        width: "70%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },

    holoImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",

    }




});
