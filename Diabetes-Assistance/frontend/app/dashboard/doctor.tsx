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
import { i18n } from "@/src/i18n/i18n";

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
      <Text style={styles.header}>{i18n.t("doctor.dashboardTitle")}</Text>

      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={[styles.card, { backgroundColor: "#dcfce7" }]}>
          <Text style={styles.cardTitle}>{i18n.t("doctor.level1")}</Text>
          <Text style={styles.cardValue}>{summary.level1}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fef3c7" }]}>
          <Text style={styles.cardTitle}>{i18n.t("doctor.level2")}</Text>
          <Text style={styles.cardValue}>{summary.level2}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fee2e2" }]}>
          <Text style={styles.cardTitle}>{i18n.t("doctor.level3")}</Text>
          <Text style={styles.cardValue}>{summary.level3}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push("/profile/doctor" as any)}
        style={{
          backgroundColor: "#2563eb",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}>
         <Text>go To profile</Text>
      </TouchableOpacity>

      {/* HIGH RISK PATIENTS */}
      <Text style={styles.sectionTitle}>
        🔴 {i18n.t("doctor.highRiskTitle")}
      </Text>

      {highRisk.length === 0 && (
        <Text style={styles.emptyText}>{i18n.t("doctor.noHighRisk")}</Text>
      )}

      {highRisk.map((item: any) => (
        <View key={item._id} style={styles.patientCard}>
          <Text style={styles.patientName}>
            {/* Using interpolation for "Patient: email" */}
            {i18n.t("doctor.patientLabel", {
              email: item.userId?.email ?? i18n.t("doctor.unknown"),
            })}
          </Text>

          <Text>
            {i18n.t("doctor.riskLevelLabel", { level: item.riskLevel })}
          </Text>

          <Text style={styles.warningText}>
            ⚠️ {i18n.t("doctor.footUlcerWarning")}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(`/chat?patientId=${item.userId?._id}` as any)
            }
            style={styles.chatButton}
          >
            <Text style={styles.chatButtonText}>
              {i18n.t("doctor.chatWithPatient")}
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
    marginTop:28
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
