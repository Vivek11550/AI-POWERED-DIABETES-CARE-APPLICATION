import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { i18n } from "../../src/i18n/i18n";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

export default function RecommendationDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>Recommendations</Text>
          <TouchableOpacity onPress={() => router.push("/profile/patient" as any)}>
             <Ionicons name="person-circle-outline" size={32} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Personalized guidance based on your health assessment.</Text>

        {/* Primary Health Assessment - Highlighted Card */}
        <TouchableOpacity
          onPress={() => router.push("/assessment" as any)}
          style={styles.mainCard}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="clipboard-outline" size={28} color="#fff" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.mainCardTitle}>{i18n.t("dashboard.assessmentTitle")}</Text>
            <Text style={styles.mainCardSubtext}>{i18n.t("dashboard.assessmentSub")}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Grid Section for Recommendations */}
        <View style={styles.gridContainer}>
          
          {/* Diet Card */}
          <TouchableOpacity
            onPress={() => router.push("/diet" as any)}
            style={[styles.gridCard, { borderLeftColor: "#16a34a" }]}
          >
            <Ionicons name="restaurant-outline" size={30} color="#16a34a" />
            <Text style={styles.gridTitle}>{i18n.t("dashboard.dietTitle")}</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              {i18n.t("dashboard.dietSub")}
            </Text>
          </TouchableOpacity>

          {/* Exercise Card */}
          <TouchableOpacity
            onPress={() => router.push("/exercise" as any)}
            style={[styles.gridCard, { borderLeftColor: "#f59e0b" }]}
          >
            <Ionicons name="fitness-outline" size={30} color="#f59e0b" />
            <Text style={styles.gridTitle}>{i18n.t("dashboard.exerciseTitle")}</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              {i18n.t("dashboard.exerciseSub")}
            </Text>
          </TouchableOpacity>

          {/* Foot Care Card */}
          <TouchableOpacity
            onPress={() => router.push("/footcare" as any)} // Keeping your existing functionality
            style={[styles.gridCard, { borderLeftColor: "#0ea5e9" }]}
          >
            <Ionicons name="medkit-outline" size={30} color="#0ea5e9" />
            <Text style={styles.gridTitle}>Foot Care</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              Essential daily checks and routines.
            </Text>
          </TouchableOpacity>

          {/* Profile Card */}
          <TouchableOpacity
            onPress={() => router.push("/profile/patient" as any)}
            style={[styles.gridCard, { borderLeftColor: "#64748b" }]}
          >
            <Ionicons name="settings-outline" size={30} color="#64748b" />
            <Text style={styles.gridTitle}>Profile</Text>
            <Text style={styles.gridSubtext}>Manage your health settings.</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    marginTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 10,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 25,
    lineHeight: 20,
  },
  mainCard: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 14,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  mainCardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  mainCardSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  gridCard: {
    backgroundColor: "white",
    width: "47%", // Nearly half width for two columns
    padding: 16,
    borderRadius: 18,
    borderLeftWidth: 5,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 5,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 4,
  },
  gridSubtext: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
});