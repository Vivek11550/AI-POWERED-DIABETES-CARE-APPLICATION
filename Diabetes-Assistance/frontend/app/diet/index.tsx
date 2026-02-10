import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function DietScreen() {
  const [riskLevel, setRiskLevel] = useState("Level 1");

  useEffect(() => {
    loadLatestAssessment();
  }, []);

  const loadLatestAssessment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/assessment/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRiskLevel(res.data.riskLevel);
    } catch (err) {
      console.log(err);
    }
  };

  const fullDietPlan = [
    { time: "6:00 AM - 7:00 AM", title: "Early Morning", icon: "sunny-outline", items: ["Warm water with methi seeds (soaked overnight)", "1 cup unsweetened green tea / black coffee"], color: "#0ea5e9" },
    { time: "8:00 AM - 9:00 AM", title: "Breakfast", icon: "restaurant-outline", items: ["2 multigrain chapatis OR 1 bowl oats porridge", "1 boiled egg OR 1 glass toned milk", "½ apple or papaya slices"], color: "#2563eb" },
    { time: "11:00 AM", title: "Mid-Morning Snack", icon: "leaf-outline", items: ["Small bowl sprouts salad (moong + cucumber)", "5–6 almonds or walnuts"], color: "#16a34a" },
    { time: "1:00 PM", title: "Lunch", icon: "fast-food-outline", items: ["2 multigrain chapatis", "1 bowl dal (no ghee)", "1 cup seasonal vegetables", "1 bowl salad & 1 cup plain curd"], color: "#8b5cf6" },
    { time: "4:00 PM - 5:00 PM", title: "Evening Snack", icon: "cafe-outline", items: ["1 cup roasted chana OR 1 veg sandwich (brown bread)", "Green tea (no sugar)"], color: "#f59e0b" },
    { time: "7:00 PM - 8:00 PM", title: "Dinner", icon: "moon-outline", items: ["2 chapatis OR 1 cup brown rice", "1 bowl dal / lean chicken / fish curry", "1 cup stir-fried green vegetables", "Beetroot & Cabbage salad"], color: "#1e293b" },
    { time: "10:00 PM", title: "Bedtime", icon: "bed-outline", items: ["1 glass warm toned milk (unsweetened)"], color: "#64748b" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Diet Plan</Text>
          <View style={[styles.badge, badgeColor(riskLevel)]}>
            <Text style={styles.badgeText}>{riskLevel} Profile</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Daily 1500–1600 kcal plan focused on low glycemic index foods to stabilize sugar levels.
        </Text>

        {fullDietPlan.map((item, index) => (
          <DietCard 
            key={index}
            time={item.time}
            title={item.title}
            items={item.items}
            icon={item.icon}
            color={item.color}
            isLast={index === fullDietPlan.length - 1}
          />
        ))}

        {/* Pro-Tip Section */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <View style={styles.tipTextContent}>
            <Text style={styles.tipTitle}>Quick Tip</Text>
            <Text style={styles.tipText}>Use olive or mustard oil in small amounts and stay hydrated throughout the day.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DietCard({ time, title, items, icon, color, isLast }: any) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeading}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardTime}>{time}</Text>
        </View>
        <View style={styles.itemsList}>
          {items.map((item: string, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={[styles.bullet, { color: color }]}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20 },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10 
  },
  title: { fontSize: 28, fontWeight: "800", color: "#1e293b" },
  description: { fontSize: 14, color: "#64748b", marginBottom: 25, lineHeight: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: "white", fontWeight: "700", fontSize: 12 },
  
  // Timeline Styles
  timelineRow: { flexDirection: "row", minHeight: 100 },
  timelineLeading: { alignItems: "center", marginRight: 15 },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center",
    zIndex: 2
  },
  timelineLine: { 
    width: 2, 
    flex: 1, 
    backgroundColor: "#e2e8f0", 
    marginVertical: 4 
  },

  // Card Styles
  card: { 
    flex: 1, 
    backgroundColor: "white", 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 8
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  cardTime: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  itemsList: { gap: 6 },
  itemRow: { flexDirection: "row", alignItems: "flex-start" },
  bullet: { fontSize: 18, marginRight: 8, marginTop: -2 },
  itemText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20 },

  // Tip Card
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fef3c7",
    marginTop: 10,
    alignItems: "center"
  },
  tipTextContent: { marginLeft: 12, flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: "bold", color: "#92400e" },
  tipText: { fontSize: 13, color: "#b45309", marginTop: 2 }
});

function badgeColor(level: string) {
  if (level === "Level 3") return { backgroundColor: "#dc2626" };
  if (level === "Level 2") return { backgroundColor: "#f59e0b" };
  return { backgroundColor: "#16a34a" };
}