import { Text, StyleSheet } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";

export default function RiskDescription({
  level,
}: {
  level: string;
}) {
  const { t } = useLanguage();

  const text =
    level === "Level 3"
      ? t("riskDesc.high")
      : level === "Level 2"
      ? t("riskDesc.moderate")
      : t("riskDesc.low");

  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 20,
  },
});


