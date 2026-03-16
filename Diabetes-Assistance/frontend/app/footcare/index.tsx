import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Linking,
  Platform
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

export default function FootCareScreen() {
  const [playing, setPlaying] = useState(false);
  const router = useRouter();

  const instructions = [
    { id: 1, text: "Daily inspection – check for cuts, blisters, or redness.", icon: "eye-outline", color: "#2563eb" },
    { id: 2, text: "Wash daily with lukewarm water & dry between toes.", icon: "water-outline", color: "#0ea5e9" },
    { id: 3, text: "Moisturize skin (avoid putting lotion between toes).", icon: "beaker-outline", color: "#8b5cf6" },
    { id: 4, text: "Trim nails straight across; avoid cutting corners.", icon: "cut-outline", color: "#f59e0b" },
    { id: 5, text: "Wear clean, cotton socks and change them daily.", icon: "shirt-outline", color: "#10b981" },
    { id: 6, text: "Choose soft, well-fitted shoes; avoid high heels.", icon: "walk-outline", color: "#ef4444" },
    { id: 7, text: "Never walk barefoot indoors or outdoors.", icon: "alert-circle-outline", color: "#dc2626" },
    { id: 8, text: "Protect feet from extreme heat or cold.", icon: "thermometer-outline", color: "#f97316" },
  ];

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= HEADER CONFIG ================= */}
      <Stack.Screen 
        options={{
          title: "Foot Care Guide",
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
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Healthy Feet</Text>
          <Text style={styles.subtitle}>Prevent complications with these daily routines</Text>
        </View>

        {/* Video Card Section */}
        <View style={styles.videoCard}>
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={200}
              play={playing}
              videoId={"ipaf1U2N00c"} 
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoInfo}>
            <View style={styles.videoHeader}>
              <Ionicons name="play-circle" size={18} color="#0ea5e9" />
              <Text style={styles.videoLabel}>Educational Video</Text>
            </View>
            <Text style={styles.videoTitle}>Foot care in Diabetes Mellitus</Text>
            <Text style={styles.videoSub}>A professional guide by Shubhangi Gaikwad</Text>
          </View>
        </View>

        {/* Instructions List Section */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="list" size={20} color="#1e293b" />
          <Text style={styles.sectionTitle}>Daily Management</Text>
        </View>

        <View style={styles.listContainer}>
          {instructions.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.instructionItem, 
                index === instructions.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + "15" }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.instructionText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Warning Section */}
        <TouchableOpacity 
          style={styles.warningCard}
          activeOpacity={0.8}
          onPress={() => Linking.openURL('tel:108')} // Updated to Indian emergency number
        >
          <View style={styles.warningHeader}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="medical" size={22} color="white" />
            </View>
            <View style={styles.warningTextGroup}>
              <Text style={styles.warningTitle}>When to see a Doctor?</Text>
              <Text style={styles.warningText}>
                Report any wounds, redness, or swelling immediately. Do not treat corns yourself.
              </Text>
            </View>
          </View>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyText}>Contact Clinic</Text>
            <Ionicons name="call" size={14} color="#b91c1c" style={{marginLeft: 4}} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  
  // Video Styles
  videoCard: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  videoWrapper: { backgroundColor: "#000" },
  videoInfo: { padding: 16 },
  videoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  videoLabel: { fontSize: 11, fontWeight: '700', color: '#0ea5e9', textTransform: 'uppercase', marginLeft: 6 },
  videoTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  videoSub: { fontSize: 13, color: "#64748b", marginTop: 2 },

  // List Styles
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  listContainer: { 
    backgroundColor: "white", 
    borderRadius: 24, 
    paddingHorizontal: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  instructionText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20, fontWeight: '500' },

  // Warning Card
  warningCard: {
    backgroundColor: "#fff1f2",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe4e6",
    marginBottom: 10,
  },
  warningHeader: { flexDirection: "row", alignItems: "flex-start" },
  warningIconCircle: { 
    backgroundColor: '#e11d48', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  warningTextGroup: { flex: 1, marginLeft: 14 },
  warningTitle: { fontSize: 16, fontWeight: "800", color: "#9f1239" },
  warningText: { fontSize: 13, color: "#be123c", marginTop: 4, lineHeight: 18 },
  emergencyBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-end', 
    backgroundColor: '#ffe4e6', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10, 
    marginTop: 10 
  },
  emergencyText: { fontSize: 12, fontWeight: '700', color: '#b91c1c' }
});