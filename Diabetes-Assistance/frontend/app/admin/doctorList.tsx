import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";

export default function doctorList() {
  const [doctors, setDoctors] = useState([]);
  const [count, setCount] = useState(0);
  const { t } = useLanguage();

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/doctors");
      setDoctors(res.data.doctors);
      setCount(res.data.count);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t("adminList.fetchError");
      alert(message);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.fullName}</Text>

      <Text style={styles.label}>
        {t("adminList.specialization")}:
        <Text style={styles.value}> {item.specialization}</Text>
      </Text>

      <Text style={styles.label}>
        {t("adminList.qualification")}:
        <Text style={styles.value}> {item.qualification}</Text>
      </Text>

      <Text style={styles.label}>
        {t("adminList.hospital")}:
        <Text style={styles.value}> {item.hospitalName}</Text>
      </Text>

      <Text style={styles.label}>
        {t("adminList.experience")}:
        <Text style={styles.value}>
          {" "}
          {item.experienceYears} {t("adminList.years")}
        </Text>
      </Text>

      <Text style={styles.email}>
        {t("adminList.email")}: {item.userId?.email}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {t("adminList.totalDoctors")}: {count}
      </Text>

      <FlatList
        data={doctors}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f7fa",
  },
  header: {
    marginTop:35,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // Elevation (Android)
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginTop: 2,
  },
  value: {
    fontWeight: "600",
    color: "#1e293b",
  },
  email: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
  },
});