import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Correct library
import { useEffect, useState, useCallback } from "react";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { useAuth } from "@/src/context/AuthContext";

const { width } = Dimensions.get("window");

export default function DoctorDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(3); 

  const [summary, setSummary] = useState({ level1: 0, level2: 0, level3: 0 });
  const [patients, setPatients] = useState<{ [key: number]: any[] }>({
    3: [], 2: [], 1: [],
  });

  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/doctor/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);
      setPatients({
        3: res.data.highRisk || [],
        2: res.data.medRisk || [],
        1: res.data.lowRisk || [],
      });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    // edges={['top']} ensures the content doesn't go under the notch
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} /> 

      {/* --- CUSTOM TOP BAR --- */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Expert Panel</Text>
          <Text style={styles.doctorTitle}>Clinical Overview</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity 
            onPress={() => router.push("/profile/doctor" as any)} 
            style={styles.circleBtn}
          >
            <Ionicons name="person" size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={[styles.circleBtn, { marginLeft: 10 }]}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- ANALYTICS CARDS --- */}
      <View style={styles.analyticsRow}>
        <TouchableOpacity onPress={() => router.push("/doctor/patientAssessments")} style={styles.mainActionCard}>
           <Ionicons name="clipboard" size={24} color="#0EA5E9" />
           <Text style={styles.actionCardLabel}>All Assessments</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/export/exportData" as any)} style={styles.mainActionCard}>
           <Ionicons name="cloud-download" size={24} color="#10B981" />
           <Text style={styles.actionCardLabel}>Export Data</Text>
        </TouchableOpacity>
      </View>

      {/* --- TAB NAVIGATION --- */}
      <View style={styles.tabContainer}>
        {[3, 2, 1].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setActiveTab(level)}
            style={[
              styles.tab,
              activeTab === level && styles.activeTab,
              activeTab === level && { borderBottomColor: level === 3 ? '#EF4444' : level === 2 ? '#F59E0B' : '#10B981' }
            ]}
          >
            <Text style={[styles.tabLabel, activeTab === level && styles.activeTabLabel]}>
              Level {level}
            </Text>
            <Text style={[styles.tabCount, activeTab === level && { color: '#0F172A' }]}>
              {summary[`level${level}` as keyof typeof summary]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.listSectionTitle}>
          {activeTab === 3 ? "🔥 High Priority" : activeTab === 2 ? "⚠️ Moderate Risk" : "✅ Stable Patients"}
        </Text>

        {patients[activeTab].length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>No patients in this category</Text>
          </View>
        ) : (
          patients[activeTab].map((patient) => (
            <View key={patient._id} style={styles.patientCard}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientEmail} numberOfLines={1}>{patient.userId?.email || "No Email"}</Text>
                <Text style={styles.patientId}>Patient ID: {patient.userId?._id?.substring(0, 12)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.chatBtn}
                onPress={() => router.push(`/chat?patientId=${patient.userId?._id}` as any)}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                <Text style={styles.chatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  welcomeText: { fontSize: 13, color: '#64748B', fontWeight: '700', textTransform: 'uppercase' },
  doctorTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  topActions: { flexDirection: 'row' },
  circleBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
  },
  analyticsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  mainActionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  actionCardLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 8 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  activeTab: { backgroundColor: '#F8FAFC' },
  tabLabel: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  activeTabLabel: { color: '#0F172A', fontWeight: '800' },
  tabCount: { fontSize: 16, fontWeight: '900', color: '#94A3B8', marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  listSectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: 15 },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
  },
  patientInfo: { flex: 1 },
  patientEmail: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  patientId: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  chatBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6
  },
  chatBtnText: { color: 'white', fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontWeight: '500' }
});