import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

export default function FootCareScreen() {
  const [playing, setPlaying] = useState(false);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Foot Care Guide</Text>
          <Text style={styles.subtitle}>Essential daily routines for diabetic health</Text>
        </View>

        {/* Video Section */}
        <View style={styles.videoCard}>
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={200}
              play={playing}
              videoId={"aZvI9zElGX0"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>Video: How to Take Care of Your Feet</Text>
            <Text style={styles.videoSub}>Watch this 4-minute guide by Nucleus Medical Media</Text>
          </View>
        </View>

        {/* Instructions List */}
        <Text style={styles.sectionTitle}>Daily Management</Text>
        <View style={styles.listContainer}>
          {instructions.map((item) => (
            <View key={item.id} style={styles.instructionItem}>
              <View style={[styles.iconBox, { backgroundColor: item.color + "15" }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.instructionText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Warning Section */}
        <TouchableOpacity 
          style={styles.warningCard}
          onPress={() => Linking.openURL('tel:911')} // Optional: Link to emergency or clinic
        >
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#b91c1c" />
            <Text style={styles.warningTitle}>When to see a Doctor?</Text>
          </View>
          <Text style={styles.warningText}>
            Report any wounds, infections, or changes in skin color immediately. Do not self-treat corns or calluses.
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "800", color: "#1e293b" },
  subtitle: { fontSize: 15, color: "#64748b", marginTop: 4 },
  
  // Video Styles
  videoCard: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  videoWrapper: { backgroundColor: "#000" },
  videoInfo: { padding: 15 },
  videoTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  videoSub: { fontSize: 13, color: "#64748b", marginTop: 2 },

  // List Styles
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 15 },
  listContainer: { backgroundColor: "white", borderRadius: 20, padding: 10, marginBottom: 20 },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  instructionText: { flex: 1, fontSize: 14, color: "#334155", lineHeight: 20 },

  // Warning Card
  warningCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
    marginBottom: 30,
  },
  warningHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  warningTitle: { fontSize: 16, fontWeight: "bold", color: "#991b1b", marginLeft: 10 },
  warningText: { fontSize: 14, color: "#b91c1c", lineHeight: 20 },
});