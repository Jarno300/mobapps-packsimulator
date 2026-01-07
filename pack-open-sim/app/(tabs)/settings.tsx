import {
  StyleSheet,
  Switch,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { usePlayer } from "@/contexts/player-context";
import { SettingCard } from "@/components/ui/setting-card";
import { SectionHeader } from "@/components/ui/section-header";
import { AppHeader } from "@/components/ui/app-header";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import {
  signInWithGoogleWeb,
  isWeb,
  signInWithGoogleNative,
  useGoogleAuth,
} from "@/services/firebase-auth";
import { useAudio } from "@/contexts/audio-context";
import Slider from "@react-native-community/slider";

export default function SettingsScreen() {
  const router = useRouter();
  const { setTheme, isDark } = useTheme();
  const { user, signOut } = useAuth();
  const { updatePlayer } = usePlayer();
  const { setVolumeForMainTheme, stopMainTheme } = useAudio();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const [mainThemeVolume, setMainThemeVolume] = useState(0.5);

  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (!isWeb && response?.type === "success") {
      const { id_token } = response.params as { id_token: string };
      if (id_token) {
        signInWithGoogleNative(id_token);
      }
    }
  }, [response]);

  const toggleTheme = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  const handleGoogleLogin = async () => {
    if (isWeb) {
      await signInWithGoogleWeb();
    } else {
      await promptAsync();
    }
  };

  const handleLogout = async () => {
    stopMainTheme();
    await signOut();
    updatePlayer({ isLoggedIn: false });
    router.replace("/");
  };

  const handleVolumeChange = (value: number) => {
    setMainThemeVolume(value);
    setVolumeForMainTheme(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader />
        <View style={styles.contentPadding}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Settings
            </Text>
          </View>

          <SectionHeader title="APPEARANCE" isDark={isDark} />
          <SettingCard
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            isDark={isDark}
          >
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: "#10B981" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
            />
          </SettingCard>

          <SectionHeader title="AUDIO" isDark={isDark} />
          <SettingCard
            title="Main Theme Volume"
            subtitle={`${Math.round(mainThemeVolume * 100)}%`}
            isDark={isDark}
          >
            <View style={styles.volumeContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={mainThemeVolume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#10B981"
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor="#10B981"
              />
            </View>
          </SettingCard>

          <SectionHeader title="ACCOUNT" isDark={isDark} />
          {user ? (
            <SettingCard
              title="Logged in with Google"
              subtitle={user.email || ""}
              isDark={isDark}
            >
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </SettingCard>
          ) : (
            <SettingCard
              title="Playing as Guest"
              subtitle="Sign in to sync your progress"
              isDark={isDark}
            >
              <Pressable
                style={styles.loginButton}
                onPress={handleGoogleLogin}
                disabled={!isWeb && !request}
              >
                <Text style={styles.loginButtonText}>Sign in with Google</Text>
              </Pressable>
            </SettingCard>
          )}

          <SectionHeader title="ABOUT" isDark={isDark} />
          <SettingCard title="Version" isDark={isDark}>
            <Text style={[styles.valueText, { color: colors.textSecondary }]}>
              1.0.0
            </Text>
          </SettingCard>
          <SettingCard title="Authors" isDark={isDark}>
            <Text style={[styles.valueText, { color: colors.textSecondary }]}>
              Matthias Declerck {"\n"} Jarno Mommens
            </Text>
          </SettingCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.pokemon,
  },
  valueText: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: FONTS.pokemon,
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: FONTS.pokemon,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
