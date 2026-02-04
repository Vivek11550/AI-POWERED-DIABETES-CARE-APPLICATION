import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Result() {
  const { risk } = useLocalSearchParams();

  const color =
    risk === "Level 3"
      ? "#dc2626"
      : risk === "Level 2"
      ? "#f59e0b"
      : "#16a34a";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>Your Risk Level</Text>
      <Text style={{ fontSize: 32, color, fontWeight: "bold" }}>
        {risk}
      </Text>
    </View>
  );
}
