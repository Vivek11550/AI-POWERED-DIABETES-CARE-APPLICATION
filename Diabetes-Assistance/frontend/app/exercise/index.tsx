import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useLanguage } from "@/src/context/LanguageContext";

export default function ExerciseScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const exercises = [
    {
      title: t("exercise.walkSlow"),
      sub: t("exercise.walkSlowSub"),
      met: "3.0",
      videoSource: require("../../assets/video/Slow_Walking.mp4"), 
      icon: "walk-outline",
      color: "#0ea5e9"
    },
    {
      title: t("exercise.walkBrisk"),
      sub: t("exercise.walkBriskSub"),
      met: "5.4",
      videoSource: require("../../assets/video/Brisk_Walking.mp4"),
      icon: "speedometer-outline",
      color: "#10b981"
    },
    {
      title: t("exercise.breath"),
      sub: t("exercise.breathSub"),
      met: "1.3", 
      videoSource: require("../../assets/video/Animated_Deep_Breath.mp4"),
      icon: "fitness-outline", 
      color: "#06b6d4" 
    },
    {
      title: t("exercise.yoga"),
      sub: t("exercise.yogaSub"),
      met: "3.0",
      videoSource: require("../../assets/video/yogaVideo.mp4"),
      icon: "body-outline",
      color: "#8b5cf6"
    },
    {
      title: t("exercise.cycling"),
      sub: t("exercise.cyclingSub"),
      met: "7.1",
      videoSource: require("../../assets/video/Bicycling_Video.mp4"),
      icon: "bicycle-outline",
      color: "#f59e0b"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: t("exercise.header"),
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("exercise.title")}</Text>
          <Text style={styles.headerSub}>{t("exercise.subtitle")}</Text>
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
              <View style={[styles.overlayBadge, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={16} color="white" />
                <Text style={styles.badgeText}>{t("exercise.active")}</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.exTitle}>{item.title}</Text>
                  <Text style={styles.exSub}>{item.sub}</Text>
                </View>
                <View style={[styles.metBadge, { backgroundColor: item.color + '15' }]}>
                  <Text style={[styles.metText, { color: item.color }]}>{item.met}</Text>
                  <Text style={[styles.metUnit, { color: item.color }]}>METs</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.doctorNote}>
          <View style={styles.noteHeader}>
            <Ionicons name="medical" size={18} color="#0EA5E9" />
            <Text style={styles.noteTitle}>{t("exercise.noteTitle")}</Text>
          </View>
          <Text style={styles.noteText}>{t("exercise.noteText")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  headerSub: { fontSize: 14, color: "#64748b", marginTop: 4, lineHeight: 20 },
  
  exCard: {
    backgroundColor: "white",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 3,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  videoContainer: { width: "100%", height: 180, backgroundColor: "#000", position: 'relative' },
  video: { flex: 1 },
  overlayBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  cardInfo: { padding: 20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  exSub: { fontSize: 13, color: "#64748b", marginTop: 2, fontWeight: "500" },
  
  metBadge: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 60, 
    height: 60, 
    borderRadius: 16 
  },
  metText: { fontSize: 18, fontWeight: "900" },
  metUnit: { fontSize: 9, fontWeight: "700", textTransform: 'uppercase', marginTop: -2 },
  
  doctorNote: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noteHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  noteTitle: { fontSize: 14, fontWeight: '800', color: '#0EA5E9', textTransform: 'uppercase' },
  noteText: { fontSize: 13, color: '#475569', lineHeight: 18, fontWeight: '500' }
});