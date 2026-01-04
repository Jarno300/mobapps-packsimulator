import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ImageSourcePropType } from "react-native";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "@/components/ui/poke-border";
import { THEME_COLORS } from "@/constants/colors";
import { useTheme } from "@/contexts/theme-context";

import { ThemedText } from "@/components/themed-text";
import { getCardCache } from "@/cache/setCardCache";
import { useSellCard } from "@/hooks/use-sell-card";
import { usePlayer } from "@/contexts/player-context";







export default function CardInfoScreen() {
    const colors = CheckColor();

    const { sellCard } = useSellCard();
    const { cardId } = useLocalSearchParams<{ cardId: string }>();
    const cardList = getCardCache();
    const card = cardList.find((c) => String(c.id) === cardId);
    const player = usePlayer().player;


    if (!card || !card.typeLogos || !card.rarity || card.holo === undefined || card.price === undefined) {
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
                <PokeBorder style={{ width: '100%', marginTop: 5, borderColor: colors.border }}>
                    <View style={{ width: '100%', padding: 5 }}>
                        <View style={styles.dynamicContentContainer}>
                            <ThemedText style={[styles.text, styles.staticContent, { color: colors.textSecondary }]}>NAME:</ThemedText>
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
                        <View style={styles.priceContainer}>
                            <ThemedText style={[styles.text, styles.staticContent]}>PRICE:</ThemedText>
                            <View style={[styles.priceValueContainer, styles.dynamicContent]}>
                                <ThemedText style={[styles.text,]}>{card.price.toString()}</ThemedText>
                                <Image
                                    source={require("../../../assets/images/pokecoin.png")}
                                    style={styles.styleCoin}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.sellButton}
                            onPress={() => sellCard(card)}
                            disabled={player.ownedCards[card.id] <= 0}
                        >
                            <ThemedText style={styles.text}>SELL</ThemedText>
                        </TouchableOpacity>

                    </View>
                </PokeBorder>

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

function CheckColor() {
    const { isDark } = useTheme();
    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    return colors;
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
        fontFamily: FONTS.pokemon,


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

    },

    styleCoin: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        alignSelf: "center"
    },
    priceContainer: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",


    },

    priceValueContainer: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        gap: 4

    },
    sellButton: {
        marginTop: 5,
        padding: 5,
        borderRadius: 10,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 2,
        width: "30%",
        alignSelf: "center"

    }




});
