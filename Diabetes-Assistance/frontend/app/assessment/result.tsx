import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Result() {
  const { risk } = useLocalSearchParams();
  const router = useRouter();

  // Configuration based on Risk Level
  const getRiskDetails = () => {
    switch (risk) {
      case "Level 3":
        return {
          color: "#EF4444", // Red
          bg: "#FEF2F2",
          label: "High Risk",
          icon: "alert-circle",
          caution: "URGENT: Please consult your doctor immediately. High glucose and HbA1c levels detected. Monitor for symptoms of ketoacidosis.",
          steps: ["Contact your primary physician", "Check ketone levels if possible", "Strictly follow prescribed insulin/medication"]
        };
      case "Level 2":
        return {
          color: "#F59E0B", // Orange
          bg: "#FFFBEB",
          label: "Moderate Risk",
          icon: "warning",
          caution: "CAUTION: Your levels are above target. Review your recent diet and exercise. Schedule a follow-up checkup soon.",
          steps: ["Reduce carbohydrate intake", "Increase daily physical activity", "Monitor blood sugar twice daily"]
        };
      default:
        return {
          color: "#10B981", // Green
          bg: "#F0FDF4",
          label: "Low Risk",
          icon: "checkmark-circle",
          caution: "GOOD NEWS: Your diabetic markers are currently stable. Continue your healthy lifestyle and routine checkups.",
          steps: ["Maintain current diet", "Stay hydrated", "Next routine checkup in 3 months"]
        };
    }
  };

  const config = getRiskDetails();

  const handleGoHome = () => {
    // replace ensures the assessment stack is cleared and dashboard re-renders
    router.replace("/dashboard/patient");
  };

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ title: "Assessment Result", headerShadowVisible: false }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Risk Meter Section */}
        <View style={[styles.resultCard, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon as any} size={80} color={config.color} />
          <Text style={styles.label}>Your Risk Level</Text>
          <Text style={[styles.riskValue, { color: config.color }]}>{risk}</Text>
          <View style={[styles.badge, { backgroundColor: config.color }]}>
            <Text style={styles.badgeText}>{config.label}</Text>
          </View>
        </View>

        {/* Medical Caution Message */}
        <View style={styles.cautionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="medical" size={20} color="#64748B" />
            <Text style={styles.cardTitle}>Medical Caution</Text>
          </View>
          <Text style={styles.cautionText}>{config.caution}</Text>
        </View>

        {/* Action Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Steps</Text>
          {config.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.dot, { backgroundColor: config.color }]} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Navigation */}
        <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome}>
          <Text style={styles.homeBtnText}>Return to Dashboard</Text>
          <Ionicons name="home" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 24, alignItems: "center" },
  resultCard: {
    width: "100%",
    borderRadius: 30,
    padding: 40,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  label: { fontSize: 18, color: "#64748B", marginTop: 15, fontWeight: "500" },
  riskValue: { fontSize: 42, fontWeight: "900", marginVertical: 5 },
  badge: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  badgeText: { color: "white", fontWeight: "700", textTransform: "uppercase", fontSize: 12 },
  cautionCard: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#64748B", // Neutral grey or change based on level
    elevation: 2,
  },
  card: { backgroundColor: "white", width: "100%", borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginLeft: 8 },
  cautionText: { fontSize: 15, lineHeight: 22, color: "#475569", fontWeight: "500" },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  stepText: { fontSize: 14, color: "#334155", fontWeight: "500" },
  homeBtn: {
    backgroundColor: "#0EA5E9",
    width: "100%",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0EA5E9",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  homeBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});