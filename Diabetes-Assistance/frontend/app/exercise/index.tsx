import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";

const exercises = [
  {
    title: "Slow Walking",
    sub: "3 kilometers/hour pace",
    met: "3.0",
    videoSource: require("../../assets/video/Slow_Walking.mp4"), 
    icon: "walk-outline",
    color: "#0ea5e9"
  },
  {
    title: "Brisk Walking",
    sub: "6 kilometers/hour pace",
    met: "5.4",
    videoSource: require("../../assets/video/Brisk_Walking.mp4"),
    icon: "speedometer-outline",
    color: "#10b981"
  },
  {
    title: "Running",
    sub: "8 kilometers/hour pace",
    met: "8.2",
    videoSource: require("../../assets/video/Brisk_Walking.mp4"),
    icon: "fitness-outline",
    color: "#ef4444"
  },
  {
    title: "Yoga",
    sub: "Daily half hour for sugar control",
    met: "3.0",
    videoSource: require("../../assets/video/yogaVideo.mp4"),
    icon: "body-outline",
    color: "#8b5cf6"
  },
  {
    title: "Bicycling",
    sub: "20 kilometers/hour pace",
    met: "7.1",
    videoSource: require("../../assets/video/Bicycling_Video.mp4"),
    icon: "bicycle-outline",
    color: "#f59e0b"
  }
];

export default function ExerciseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercise Plan</Text>
          <Text style={styles.headerSub}>
            Physical activity increases METs (Metabolic Equivalents) to help manage blood sugar.
          </Text>
        </View>

        {exercises.map((item, index) => (
          <View key={index} style={styles.exCard}>
            <View style={styles.videoContainer}>
              <Video
                style={styles.video}
                source={item.videoSource} 
                useNativeControls={false} 
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
              />
              <View style={styles.overlayBadge}>
                <Ionicons name={item.icon as any} size={16} color="white" />
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.exTitle}>{item.title}</Text>
                <View style={[styles.metBadge, { backgroundColor: item.color + '15' }]}>
                  <Text style={[styles.metText, { color: item.color }]}>{item.met} METs</Text>
                </View>
              </View>
              <Text style={styles.exSub}>{item.sub}</Text>
            </View>
          </View>
        ))}

        {/* Doctor's Note */}
        <View style={styles.doctorNote}>
          <Ionicons name="information-circle" size={20} color="#64748b" />
          <Text style={styles.noteText}>
            Walking up stairs (4.7 METs) and regular swimming are also highly recommended.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1e293b" },
  headerSub: { fontSize: 14, color: "#64748b", marginTop: 5, lineHeight: 20 },
  
  exCard: {
    backgroundColor: "white",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    // Premium Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  videoContainer: { width: "100%", height: 200, backgroundColor: "#f1f5f9", position: 'relative' },
  video: { flex: 1 },
  overlayBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 12,
  },
  cardInfo: { padding: 18 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  metBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  metText: { fontSize: 12, fontWeight: "800" },
  exSub: { fontSize: 14, color: "#64748b", marginTop: 4, fontWeight: "500" },
  
  doctorNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    gap: 10
  },
  noteText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 }
});