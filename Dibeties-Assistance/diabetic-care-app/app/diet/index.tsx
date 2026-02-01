import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DietScreen() {
  const [riskLevel, setRiskLevel] = useState("Level 1");

  useEffect(() => {
    loadLatestAssessment();
  }, []);

  const loadLatestAssessment = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/assessment/latest", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRiskLevel(res.data.riskLevel);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Diet Recommendation</Text>

      <View style={[styles.badge, badgeColor(riskLevel)]}>
        <Text style={styles.badgeText}>{riskLevel}</Text>
      </View>

      <DietCard
        title="Breakfast"
        items={getDiet(riskLevel).breakfast}
      />

      <DietCard
        title="Lunch"
        items={getDiet(riskLevel).lunch}
      />

      <DietCard
        title="Dinner"
        items={getDiet(riskLevel).dinner}
      />
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DietCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, index) => (
        <Text key={index}>• {item}</Text>
      ))}
    </View>
  );
}

/* ---------------- DATA ---------------- */

function getDiet(level: string) {
  if (level === "Level 3") {
    return {
      breakfast: ["Oats", "Boiled eggs", "Green tea"],
      lunch: ["Steamed vegetables", "Dal", "Brown rice"],
      dinner: ["Soup", "Salad"],
    };
  }

  if (level === "Level 2") {
    return {
      breakfast: ["Multigrain roti", "Vegetables"],
      lunch: ["Chapati", "Sabzi", "Curd"],
      dinner: ["Light dal", "Salad"],
    };
  }

  return {
    breakfast: ["Fruits", "Milk"],
    lunch: ["Balanced meal"],
    dinner: ["Light dinner"],
  };
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  badge: {
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  badgeText: { color: "white", fontWeight: "bold" },
  card: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: { fontWeight: "bold", marginBottom: 5 },
});

function badgeColor(level: string) {
  if (level === "Level 3") return { backgroundColor: "#dc2626" };
  if (level === "Level 2") return { backgroundColor: "#f59e0b" };
  return { backgroundColor: "#16a34a" };
}
