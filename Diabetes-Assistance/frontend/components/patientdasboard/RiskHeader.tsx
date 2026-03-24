import { View, Text, StyleSheet } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";

export default function RiskHeader({ level }: { level: string }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("riskHeader.title")}</Text>
      <Text style={styles.level}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  level: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
  },
});
