import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

export default function DietScreen() {
  const [riskLevel, setRiskLevel] = useState("Level 1");
  const router = useRouter();

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
      {/* ================= HEADER CONFIG ================= */}
      <Stack.Screen 
        options={{
          title: "My Diet Plan",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nutrition Plan</Text>
            <Text style={styles.description}>
              Target: 1500–1600 kcal | Low Glycemic Index
            </Text>
          </View>
          <View style={[styles.badge, badgeColor(riskLevel)]}>
            <Text style={styles.badgeText}>{riskLevel}</Text>
          </View>
        </View>

        {/* Timeline Start */}
        <View style={styles.timelineContainer}>
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
        </View>

        {/* Pro-Tip Section */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#92400e" />
            <Text style={styles.tipTitle}>Expert Recommendation</Text>
          </View>
          <Text style={styles.tipText}>
            Use olive or mustard oil in small amounts. Stay hydrated by drinking at least 2.5–3 liters of water daily.
          </Text>
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
          <Ionicons name={icon} size={18} color="white" />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.timeTag}>
            <Ionicons name="time-outline" size={12} color="#64748b" style={{marginRight: 4}} />
            <Text style={styles.cardTime}>{time}</Text>
          </View>
        </View>
        <View style={styles.itemsList}>
          {items.map((item: string, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Ionicons name="checkmark-circle" size={16} color={color} style={{marginRight: 8, marginTop: 2}} />
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
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start",
    marginBottom: 25,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  description: { fontSize: 14, color: "#64748b", marginTop: 4 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: "white", fontWeight: "700", fontSize: 12, textTransform: 'uppercase' },
  
  timelineContainer: { marginTop: 10 },
  timelineRow: { flexDirection: "row", minHeight: 110 },
  timelineLeading: { alignItems: "center", marginRight: 16 },
  iconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: "center", 
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineLine: { 
    width: 2, 
    flex: 1, 
    backgroundColor: "#e2e8f0", 
    marginVertical: 4 
  },

  card: { 
    flex: 1, 
    backgroundColor: "white", 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 20,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  timeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardTime: { fontSize: 11, color: "#64748b", fontWeight: "600" },
  itemsList: { gap: 10 },
  itemRow: { flexDirection: "row", alignItems: "flex-start" },
  itemText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20, fontWeight: '500' },

  tipCard: {
    backgroundColor: "#fffbeb",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fef3c7",
    marginTop: 10,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipTitle: { fontSize: 15, fontWeight: "800", color: "#92400e", marginLeft: 8 },
  tipText: { fontSize: 14, color: "#b45309", lineHeight: 20 }
});

function badgeColor(level: string) {
  if (level === "Level 3") return { backgroundColor: "#ef4444" };
  if (level === "Level 2") return { backgroundColor: "#f59e0b" };
  return { backgroundColor: "#10b981" };
}