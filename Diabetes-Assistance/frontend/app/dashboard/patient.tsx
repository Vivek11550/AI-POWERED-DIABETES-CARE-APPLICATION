import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  RefreshControl,
  Dimensions // Added Dimensions
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { i18n } from "../../src/i18n/i18n";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RiskHeader from "../../components/patientdasboard/RiskHeader";
import RiskProgressBar from "../../components/patientdasboard/RiskProgressBar";
import RiskDescription from "../../components/patientdasboard/RiskDescription";
import RiskFactorList from "../../components/patientdasboard/RiskFactorList";

// Calculate column width to prevent "half-visible" or stretching buttons
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40 - 12) / 2; // (Total Width - Padding - Gap) / 2

export default function PatientDashboard() {
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      await Promise.all([loadLatestAssessment(), loadPatientChat()]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
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
      setAssessment(null);
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
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading health data...</Text>
      </View>
    );
  }

  const riskPercentage = assessment?.riskLevel === "Level 3" ? 85 : assessment?.riskLevel === "Level 2" ? 55 : 25;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />}
      >
        
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello, Patient</Text>
            <Text style={styles.appTitle}> Your Dashboard</Text>
          </View>
          <LanguageSwitcher />
        </View>

        {!assessment ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={50} color="#94A3B8" />
            <Text style={styles.emptyText}>No health assessment found</Text>
            <TouchableOpacity 
              onPress={() => router.push("/recommendation/recommendation" as any)}
              style={styles.primaryAction}
            >
              <Text style={styles.primaryActionText}>Start Assessment Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Risk Analysis</Text>
                <Ionicons name="pulse" size={20} color="#0EA5E9" />
              </View>
              <RiskHeader level={assessment.riskLevel} />
              <View style={styles.divider} />
              <RiskProgressBar percentage={riskPercentage} />
              <RiskDescription level={assessment.riskLevel} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Your Health Metrics</Text>
              <TouchableOpacity onPress={() => router.push("/recommendation/recommendation" as any)}>
                <Text style={styles.retestLink}>Retest</Text>
              </TouchableOpacity>
            </View>
            <RiskFactorList assessment={assessment} />
          </>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Quick Actions</Text>
        
        {/* Adjusted Grid Container */}
        <View style={styles.buttonGrid}>
          <TouchableOpacity 
            onPress={() => router.push("/recommendation/recommendation" as any)}
            style={[styles.gridButton, { backgroundColor: "#4f46e5" }]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="flask" size={22} color="white" />
            </View>
            <Text style={styles.buttonText}>Health Tips</Text>
          </TouchableOpacity>

          {chatId && (
            <TouchableOpacity
              onPress={() => router.push(`/chat?chatId=${chatId}` as any)}
              style={[styles.gridButton, { backgroundColor: "#0ea5e9" }]}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="chatbubbles" size={22} color="white" />
              </View>
              <Text style={styles.buttonText}>Consult Doctor</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => router.push("/profile/patient" as any)}
            style={[styles.gridButton, { backgroundColor: "#64748b" }]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="person" size={22} color="white" />
            </View>
            <Text style={styles.buttonText}>My Profile</Text>
          </TouchableOpacity>

         <TouchableOpacity 
  onPress={() => router.push("/quiz/dashboard" as any)}
  style={[styles.gridButton, { backgroundColor: "#10B981" }]} 
>
  <View style={styles.iconCircle}>
    {/* Changed icon to puzzle-piece or library for a 'Knowledge' feel */}
    <Ionicons name="extension-puzzle" size={22} color="white" />
  </View>
  <Text style={styles.buttonText}>Health Quiz</Text>
</TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC"
  },
  loadingText: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    textTransform: 'uppercase'
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155'
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  retestLink: {
    color: '#0EA5E9',
    fontWeight: '700',
    fontSize: 18
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Consistent gap
    marginTop: 10,
  },
  gridButton: {
    // FIXED WIDTH DESIGN
    width: COLUMN_WIDTH, 
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed'
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 10,
    fontWeight: '500'
  },
  primaryAction: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20
  },
  primaryActionText: {
    color: '#FFF',
    fontWeight: '700'
  }
});