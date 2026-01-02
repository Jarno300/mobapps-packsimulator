import { StyleSheet, Switch, View, Text, ScrollView } from "react-native";
import { useTheme } from "@/contexts/theme-context";

function SettingCard({
  title,
  subtitle,
  isDark,
  children,
}: {
  title: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
          borderColor: isDark ? "#2A2D32" : "#E8E8E8",
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? "#FFFFFF" : "#1F2937" },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.cardSubtitle,
                { color: isDark ? "#8B8F96" : "#6B7280" },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {children}
      </View>
    </View>
  );
}

function SectionHeader({ title, isDark }: { title: string; isDark: boolean }) {
  return (
    <Text
      style={[styles.sectionHeader, { color: isDark ? "#8B8F96" : "#6B7280" }]}
    >
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const { setTheme, isDark } = useTheme();

  const toggleTheme = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121316" : "#F3F4F6" },
      ]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#FFFFFF" : "#1F2937" }]}
            >
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

          <SectionHeader title="ABOUT" isDark={isDark} />
          <SettingCard title="Version" isDark={isDark}>
            <Text
              style={[
                styles.valueText,
                { color: isDark ? "#8B8F96" : "#6B7280" },
              ]}
            >
              1.0.0
            </Text>
          </SettingCard>
          <SettingCard title="Authors" isDark={isDark}>
            <Text
              style={[
                styles.valueText,
                { color: isDark ? "#8B8F96" : "#6B7280" },
              ]}
            >
              Matthias Declerck <br /> Jarno Mommens
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
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardText: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  valueText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
