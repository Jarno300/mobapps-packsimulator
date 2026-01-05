import { View, Image, StyleSheet } from "react-native";

interface AppHeaderProps {
  showPokemonLogo?: boolean;
}

export function AppHeader({ showPokemonLogo = false }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {showPokemonLogo && (
        <Image
          source={require("@/assets/images/pokemon-text-logo.png")}
          style={styles.pokemonLogo}
          resizeMode="contain"
        />
      )}
      <Image
        source={require("@/assets/images/pack-opener-simulator-title.png")}
        style={[
          styles.simulatorTitle,
          !showPokemonLogo && styles.simulatorTitleOnly,
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#EF4444",
    paddingTop: 25,
    paddingBottom: 12,
    alignItems: "center",
  },
  pokemonLogo: {
    width: 180,
    height: 65,
  },
  simulatorTitle: {
    width: 140,
    height: 16,
    marginTop: 2,
  },
  simulatorTitleOnly: {
    marginTop: 0,
  },
});
