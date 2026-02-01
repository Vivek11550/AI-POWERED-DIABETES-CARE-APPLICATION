import { View, Text, ScrollView, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function ExerciseScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exercise Plan</Text>

      <ExerciseCard
        title="Walking"
        desc="30 minutes daily"
        // animation={require("../../assets/lottie/walking.json")}
      />

      <ExerciseCard
        title="Yoga"
        desc="Improves insulin sensitivity"
        // animation={require("../../assets/lottie/yoga.json")}
      />

      <ExerciseCard
        title="Breathing"
        desc="Reduces stress"
        // animation={require("../../assets/lottie/breathing.json")}
      />
    </ScrollView>
  );
}

/* ---------------- COMPONENT ---------------- */

function ExerciseCard({
  title,
  desc,
  animation,
}: any) {
  return (
    <View style={styles.card}>
      <LottieView
        source={animation}
        autoPlay
        loop
        style={{ height: 150 }}
      />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text>{desc}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
});
