import { Text, StyleSheet } from "react-native";

export default function RiskDescription({
  level,
}: {
  level: string;
}) {
  const text =
    level === "Level 3"
      ? "You are at high risk. Immediate lifestyle and medical attention is recommended."
      : level === "Level 2"
      ? "You are at moderate risk. Lifestyle improvements can significantly reduce your risk."
      : "You are at low risk. Maintain healthy habits to stay protected.";

  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 20,
  },
});
