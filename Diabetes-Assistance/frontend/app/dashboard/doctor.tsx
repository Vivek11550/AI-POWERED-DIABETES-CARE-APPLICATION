// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API from "../../src/services/api";
// import { i18n } from "@/src/i18n/i18n";

// type Summary = {
//   level1: number;
//   level2: number;
//   level3: number;
// };

// export default function DoctorDashboard() {
//   const [summary, setSummary] = useState<Summary>({
//     level1: 0,
//     level2: 0,
//     level3: 0,
//   });

//   const [highRisk, setHighRisk] = useState<any[]>([]);
//   const [medRisk, setMedRisk] = useState<any[]>([]);
//   const [lowRisk, setLowRisk] = useState<any[]>([]);

//   const router = useRouter();

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const res = await API.get("/doctor/dashboard", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSummary(res.data.summary);
//       setHighRisk(res.data.highRisk);
//       setMedRisk(res.data.medRisk);
//       setLowRisk(res.data.lowRisk);

//     } catch (error) {
//       console.log("Doctor dashboard error:", error);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* HEADER */}
//       <Text style={styles.header}>{i18n.t("doctor.dashboardTitle")}</Text>

//       {/* SUMMARY CARDS */}
//       <View style={styles.summaryRow}>
//         <View style={[styles.card, { backgroundColor: "#dcfce7" }]}>
//           <Text style={styles.cardTitle}>{i18n.t("doctor.level1")}</Text>
//           <Text style={styles.cardValue}>{summary.level1}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: "#fef3c7" }]}>
//           <Text style={styles.cardTitle}>{i18n.t("doctor.level2")}</Text>
//           <Text style={styles.cardValue}>{summary.level2}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: "#fee2e2" }]}>
//           <Text style={styles.cardTitle}>{i18n.t("doctor.level3")}</Text>
//           <Text style={styles.cardValue}>{summary.level3}</Text>
//         </View>
//       </View>

//       <TouchableOpacity onPress={() => router.push("/profile/doctor" as any)}
//         style={{
//           backgroundColor: "#2563eb",
//           padding: 20,
//           borderRadius: 12,
//           marginBottom: 15,
//         }}>
//         <Text>Go To profile</Text>
//       </TouchableOpacity>

//       {/* HIGH RISK PATIENTS */}
//       <Text style={styles.sectionTitle}>
//         🔴 {i18n.t("doctor.highRiskTitle")}
//       </Text>

//       {highRisk.length === 0 && (
//         <Text style={styles.emptyText}>{i18n.t("doctor.noHighRisk")}</Text>
//       )}

//       {highRisk.map((item: any) => (
//         <View key={item._id} style={styles.patientCard}>
//           <Text style={styles.patientName}>
//             {/* Using interpolation for "Patient: email" */}
//             {i18n.t("doctor.patientLabel", {
//               email: item.userId?.email ?? i18n.t("doctor.unknown"),
//             })}
//           </Text>

//           <Text>
//             {i18n.t("doctor.riskLevelLabel", { level: item.riskLevel })}
//           </Text>

//           <Text style={styles.warningText}>
//             ⚠️ {i18n.t("doctor.footUlcerWarning")}
//           </Text>

//           <TouchableOpacity
//             onPress={() =>
//               router.push(`/chat?patientId=${item.userId?._id}` as any)
//             }
//             style={styles.chatButton}
//           >
//             <Text style={styles.chatButtonText}>
//               {i18n.t("doctor.chatWithPatient")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,

//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     marginTop: 28
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//   },
//   card: {
//     width: "30%",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: "#374151",
//   },
//   cardValue: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   emptyText: {
//     color: "gray",
//     marginBottom: 10,
//   },
//   patientCard: {
//     backgroundColor: "#fee2e2",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 12,
//   },
//   patientName: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   warningText: {
//     color: "red",
//     marginTop: 5,
//   },
//   chatButton: {
//     marginTop: 10,
//     backgroundColor: "#2563eb",
//     padding: 10,
//     borderRadius: 6,
//   },
//   chatButtonText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { i18n } from "@/src/i18n/i18n";

/* ---------------- TYPES ---------------- */

type Summary = {
  level1: number;
  level2: number;
  level3: number;
};

type PatientItem = {
  _id: string;
  riskLevel: number;
  userId?: {
    _id: string;
    email?: string;
  };
};

type RiskSectionProps = {
  title: string;
  color: string;
  patients: PatientItem[];
};

/* ---------------- REUSABLE RISK SECTION ---------------- */

function RiskSection({ title, color, patients }: RiskSectionProps) {
  const router = useRouter();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {patients.length === 0 ? (
        <Text style={styles.emptyText}>No patients in this category</Text>
      ) : (
        patients.map((item) => (
          <View
            key={item._id}
            style={[styles.patientCard, { borderLeftColor: color }]}
          >
            <Text style={styles.patientName}>
              {i18n.t("doctor.patientLabel", {
                email: item.userId?.email ?? i18n.t("doctor.unknown"),
              })}
            </Text>

            <Text style={styles.metaText}>
              {i18n.t("doctor.riskLevelLabel", { level: item.riskLevel })}
            </Text>

            <Text style={styles.metaText}>
              Patient ID: {item.userId?._id ?? "N/A"}
            </Text>

            {item.riskLevel === 3 && (
              <Text style={styles.warningText}>
                ⚠️ {i18n.t("doctor.footUlcerWarning")}
              </Text>
            )}

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                router.push(`/chat?patientId=${item.userId?._id}` as any)
              }
            >
              <Text style={styles.chatButtonText}>
                {i18n.t("doctor.chatWithPatient")}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

/* ---------------- MAIN SCREEN ---------------- */

export default function DoctorDashboard() {
  const [summary, setSummary] = useState<Summary>({
    level1: 0,
    level2: 0,
    level3: 0,
  });

  const [highRisk, setHighRisk] = useState<PatientItem[]>([]);
  const [medRisk, setMedRisk] = useState<PatientItem[]>([]);
  const [lowRisk, setLowRisk] = useState<PatientItem[]>([]);

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
      setMedRisk(res.data.medRisk);
      setLowRisk(res.data.lowRisk);
    } catch (error) {
      console.log("Doctor dashboard error:", error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <Text style={styles.header}>
          {i18n.t("doctor.dashboardTitle")}
        </Text>

        {/* SUMMARY */}
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

        {/* PROFILE BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/profile/doctor" as any)}
          style={styles.profileButton}
        >
          <Text style={styles.profileButtonText}>Go To Profile</Text>
        </TouchableOpacity>

        <View >
          <Button
            title="View Patient Assessments"
            onPress={() => router.push("/doctor/patientAssessments")}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/export/exportData" as any)}
          style={{
            backgroundColor: "#6366f1",
            padding: 14,
            borderRadius: 8,
            marginTop: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Export Data
          </Text>
        </TouchableOpacity>

        {/* RISK SECTIONS */}
        <RiskSection
          title={`🔴 ${i18n.t("doctor.highRiskTitle")}`}
          color="#dc2626"
          patients={highRisk}
        />

        <RiskSection
          title={`🟡 ${i18n.t("doctor.level2")}`}
          color="#f59e0b"
          patients={medRisk}
        />

        <RiskSection
          title={`🟢 ${i18n.t("doctor.level1")}`}
          color="#16a34a"
          patients={lowRisk}
        />
      </ScrollView>
    </>
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
    marginTop: 28,
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
  profileButton: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },
  profileButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 25,
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
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 2,
  },
  patientName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  metaText: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 3,
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
