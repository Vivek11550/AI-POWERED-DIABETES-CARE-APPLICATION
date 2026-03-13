import { View, Text, StyleSheet } from "react-native";

export default function RiskHeader({ level }: { level: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Diabetes Risk</Text>
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
