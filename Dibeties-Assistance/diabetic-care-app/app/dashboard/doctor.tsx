import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

type Summary = {
  level1: number;
  level2: number;
  level3: number;
};

export default function DoctorDashboard() {
  const [summary, setSummary] = useState<Summary>({
    level1: 0,
    level2: 0,
    level3: 0,
  });

  const [highRisk, setHighRisk] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/doctor/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(res.data.summary);
      setHighRisk(res.data.highRisk);
    } catch (error) {
      console.log("Doctor dashboard error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>Doctor Dashboard</Text>

      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={[styles.card, { backgroundColor: "#dcfce7" }]}>
          <Text style={styles.cardTitle}>Level 1</Text>
          <Text style={styles.cardValue}>{summary.level1}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fef3c7" }]}>
          <Text style={styles.cardTitle}>Level 2</Text>
          <Text style={styles.cardValue}>{summary.level2}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fee2e2" }]}>
          <Text style={styles.cardTitle}>Level 3</Text>
          <Text style={styles.cardValue}>{summary.level3}</Text>
        </View>
      </View>

      {/* HIGH RISK PATIENTS */}
      <Text style={styles.sectionTitle}>🔴 High Risk Patients</Text>

      {highRisk.length === 0 && (
        <Text style={styles.emptyText}>
          No high-risk patients currently.
        </Text>
      )}

      {highRisk.map((item: any) => (
        <View key={item._id} style={styles.patientCard}>
          <Text style={styles.patientName}>
            Patient: {item.userId?.email ?? "Unknown"}
          </Text>

          <Text>Risk Level: {item.riskLevel}</Text>

          {item.footUlcer && (
            <Text style={styles.warningText}>
              ⚠️ Foot Ulcer Detected
            </Text>
          )}

          <TouchableOpacity
            onPress={() =>
              router.push(
                `/chat?patientId=${item.userId?._id}` as any
              )
            }
            style={styles.chatButton}
          >
            <Text style={styles.chatButtonText}>
              Chat with Patient
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  card: {
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: "#374151",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    color: "gray",
    marginBottom: 10,
  },
  patientCard: {
    backgroundColor: "#fee2e2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  patientName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  warningText: {
    color: "red",
    marginTop: 5,
  },
  chatButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 6,
  },
  chatButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
