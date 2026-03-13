import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { i18n } from "../../src/i18n/i18n";
import { useRouter } from "expo-router";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RiskHeader from "../../components/patientdasboard/RiskHeader";
import RiskProgressBar from "../../components/patientdasboard/RiskProgressBar";
import RiskDescription from "../../components/patientdasboard/RiskDescription";
import RiskFactorList from "../../components/patientdasboard/RiskFactorList";

export default function PatientDashboard() {
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadLatestAssessment(), loadPatientChat()]).finally(() => setLoading(false));
  }, []);

  const loadLatestAssessment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/assessment/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessment(res.data);
    } catch (err) {
      console.log("Assessment error", err);
    }
  };

  const loadPatientChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/chat/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatId(res.data._id);
    } catch {
      setChatId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!assessment) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No assessment found</Text>
         <TouchableOpacity 
            onPress={() => router.push("/recommendation/recommendation" as any)}
            style={[styles.actionButton, { backgroundColor: "#4f46e5" }]}
          >
            <Text style={styles.buttonIcon}>🎯</Text>
            <View>
              <Text style={styles.buttonText}>perform health assesmet</Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }

  const riskPercentage =
    assessment.riskLevel === "Level 3" ? 85 : assessment.riskLevel === "Level 2" ? 55 : 25;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{i18n.t("patientDashboard")}</Text>
          <LanguageSwitcher />
        </View>

        {/* Risk Card */}
        <View style={styles.card}>
          <RiskHeader level={assessment.riskLevel} />
          <View style={styles.divider} />
          <RiskProgressBar percentage={riskPercentage} />
          <RiskDescription level={assessment.riskLevel} />
        </View>

        {/* Detailed Stats */}
        <Text style={styles.sectionLabel}>Your Health Metrics</Text>
        <RiskFactorList assessment={assessment} />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={() => router.push("/recommendation/recommendation" as any)}
            style={[styles.actionButton, { backgroundColor: "#4f46e5" }]}
          >
            <Text style={styles.buttonIcon}>🎯</Text>
            <View>
              <Text style={styles.buttonText}>Personalized Tips</Text>
              <Text style={styles.buttonSubtext}>Based on your health data</Text>
            </View>
          </TouchableOpacity>

          {chatId && (
            <TouchableOpacity
              onPress={() => router.push(`/chat?chatId=${chatId}` as any)}
              style={[styles.actionButton, { backgroundColor: "#0ea5e9" }]}
            >
              <Text style={styles.buttonIcon}>💬</Text>
              <View>
                <Text style={styles.buttonText}>{i18n.t("dashboard.chatTitle")}</Text>
                <Text style={styles.buttonSubtext}>{i18n.t("dashboard.chatSub")}</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => router.push("/profile/patient" as any)}
            style={styles.outlineButton}
          >
            <Text style={styles.outlineButtonText}>View Full Profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Light grayish-blue background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    // Modern Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    gap: 15,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  outlineButtonText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
  }
});