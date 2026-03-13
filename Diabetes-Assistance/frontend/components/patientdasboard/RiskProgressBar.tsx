import { View, StyleSheet } from "react-native";

export default function RiskProgressBar({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${percentage}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginVertical: 10,
  },
  fill: {
    height: 6,
    backgroundColor: "#111827",
    borderRadius: 4,
  },
});
