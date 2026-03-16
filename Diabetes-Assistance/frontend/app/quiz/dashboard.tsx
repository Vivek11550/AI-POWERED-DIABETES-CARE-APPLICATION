import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import API from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

const { width } = Dimensions.get("window");

export default function QuizDashboard() {
  const router = useRouter();
  const { token } = useAuth();

  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizData = async () => {
    try {
      const res = await API.get("/quiz/comparison", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizData(res.data);
    } catch (error) {
      console.log("Quiz fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const percentage = quizData
    ? Math.round((quizData.latestScore / quizData.totalQuestions) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= HEADER CONFIG ================= */}
      <Stack.Screen 
        options={{
          title: "Knowledge Hub",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Diabetes Awareness</Text>
        <Text style={styles.subtitle}>Track your learning progress and improve your health knowledge.</Text>

        {!quizData ? (
          <View style={styles.emptyCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="school-outline" size={40} color="#10B981" />
            </View>
            <Text style={styles.emptyTitle}>Ready to learn?</Text>
            <Text style={styles.emptySub}>Take your first quiz to assess your current understanding of diabetes management.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/quiz")}
            >
              <Text style={styles.buttonText}>Start Initial Quiz</Text>
              <Ionicons name="arrow-forward" size={18} color="white" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Score Overview Card */}
            <View style={styles.mainCard}>
              <Text style={styles.scoreLabel}>Current Proficiency</Text>
              <View style={styles.percentageRow}>
                <Text style={styles.percentageText}>{percentage}%</Text>
                <View style={[styles.statusBadge, { backgroundColor: percentage > 70 ? '#DCFCE7' : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: percentage > 70 ? '#166534' : '#92400E' }]}>
                    {percentage > 70 ? 'Expert' : 'Learning'}
                  </Text>
                </View>
              </View>

              {/* Custom Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${percentage}%` }]} />
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{quizData.initialScore}</Text>
                  <Text style={styles.statLab}>Initial</Text>
                </View>
                <View style={[styles.statBox, styles.borderLeft]}>
                  <Text style={styles.statVal}>{quizData.latestScore}</Text>
                  <Text style={styles.statLab}>Latest</Text>
                </View>
                <View style={[styles.statBox, styles.borderLeft]}>
                  <Text style={[styles.statVal, { color: '#10B981' }]}>+{quizData.improvement}</Text>
                  <Text style={styles.statLab}>Growth</Text>
                </View>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Ionicons name="bulb-outline" size={20} color="#92400E" />
              <Text style={styles.tipText}>Frequent quizzes help reinforce proper insulin management techniques.</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/quiz")}
            >
              <Text style={styles.buttonText}>Retake Knowledge Test</Text>
              <Ionicons name="refresh-outline" size={18} color="white" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 15, color: "#64748B", marginTop: 4, marginBottom: 25, lineHeight: 22 },
  
  // Empty State
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  emptySub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 10, marginBottom: 25, lineHeight: 20 },

  // Main Card
  mainCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  scoreLabel: { fontSize: 13, fontWeight: "700", color: "#94A3B8", textTransform: 'uppercase', letterSpacing: 1 },
  percentageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  percentageText: { fontSize: 48, fontWeight: "900", color: "#0F172A" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  
  progressContainer: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, marginVertical: 20, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#10B981', borderRadius: 5 },

  statsGrid: { flexDirection: 'row', marginTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
  statBox: { flex: 1, alignItems: 'center' },
  borderLeft: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
  statVal: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  statLab: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 25,
    alignItems: 'center'
  },
  tipText: { flex: 1, marginLeft: 10, fontSize: 13, color: '#92400E', fontWeight: '500', lineHeight: 18 },

  primaryButton: {
    backgroundColor: "#10B981",
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});