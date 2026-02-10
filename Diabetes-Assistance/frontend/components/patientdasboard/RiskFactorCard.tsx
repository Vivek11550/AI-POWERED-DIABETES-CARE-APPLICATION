import { View, Text, StyleSheet } from "react-native";

export default function RiskFactorCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    color: "#6b7280",
  },
});
