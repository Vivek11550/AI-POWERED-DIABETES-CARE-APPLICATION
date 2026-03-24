import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { useAuth } from "@/src/context/AuthContext";

import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileTitle from "../../components/profile/ProfileTitle";
import InfoRow from "../../components/profile/InfoRow";

export default function PatientProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();

  // Ensures data refreshes every time the user views this screen
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      // Only show full-screen loader if we have no data yet
      if (!profile.fullName) setLoading(true);
      
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get("/profile/patient/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await API.put("/profile/patient", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
      setEdit(false);
      loadProfile(); 
    } catch (error) {
      alert("Error saving profile");
    }
  };

  if (loading && !profile.fullName) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen 
        options={{
          title: "My Profile",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#0EA5E9"]} // Android
            tintColor="#0EA5E9"    // iOS
          />
        }
      >
        <View style={styles.headerSection}>
          <ProfileAvatar />
          <ProfileTitle
            name={profile.fullName || "Patient"}
            subtitle="Diabetic Care Member"
          />
        </View>

        <View style={styles.contentContainer}>
          {/* ================= PERSONAL SECTION ================= */}
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>Personal Details</Text>
            </View>
            
            {edit ? (
              <>
                <EditableField label="Full Name" value={profile.fullName} onChange={(v: string) => setProfile({ ...profile, fullName: v })} />
                <EditableField label="Age" value={String(profile.age || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, age: v })} />
                <EditableField label="Phone" value={profile.phone} keyboardType="phone-pad" onChange={(v: string) => setProfile({ ...profile, phone: v })} />
              </>
            ) : (
              <>
                <InfoRow label="Full Name" value={profile.fullName || "-"} />
                <InfoRow label="Age" value={profile.age ? `${profile.age} years` : "-"} />
                <InfoRow label="Phone" value={profile.phone || "-"} />
                <InfoRow label="Gender" value={profile.gender || "-"} />
              </>
            )}
          </View>

          {/* ================= HEALTH SECTION ================= */}
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="fitness-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>Health Metrics</Text>
            </View>

            {edit ? (
              <>
                <EditableField label="Height (cm)" value={String(profile.heightCm || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, heightCm: v })} />
                <EditableField label="Weight (kg)" value={String(profile.baselineWeightKg || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, baselineWeightKg: v })} />
              </>
            ) : (
              <>
                <InfoRow label="Height" value={profile.heightCm ? `${profile.heightCm} cm` : "-"} />
                <InfoRow label="Weight" value={profile.baselineWeightKg ? `${profile.baselineWeightKg} kg` : "-"} />
                <InfoRow label="Diet" value={profile.diet === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} />
              </>
            )}
          </View>

          {/* ================= BACKGROUND SECTION ================= */}
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="school-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>Background</Text>
            </View>

            {edit ? (
              <>
                <EditableField label="Education" value={profile.education} onChange={(v: string) => setProfile({ ...profile, education: v })} />
                <EditableField label="Occupation" value={profile.occupation} onChange={(v: string) => setProfile({ ...profile, occupation: v })} />
              </>
            ) : (
              <>
                <InfoRow label="Education" value={profile.education?.replace('_', ' ') || "-"} />
                <InfoRow label="Occupation" value={profile.occupation || "-"} />
              </>
            )}
          </View>

          {/* ================= BUTTONS ================= */}
          <TouchableOpacity 
            style={[styles.mainBtn, edit ? styles.saveBtn : styles.editBtn]} 
            onPress={edit ? saveProfile : () => setEdit(true)}
          >
            <Ionicons name={edit ? "checkmark-circle" : "create"} size={20} color="#FFF" />
            <Text style={styles.btnText}>{edit ? "Save Changes" : "Edit Profile"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function EditableField({ label, value, onChange, keyboardType = "default" }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC", marginTop: 35 },
  loadingContainer: { flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' },
  backBtn: { marginLeft: 10, padding: 8 },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 3,
  },
  contentContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#334155', marginLeft: 8 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: "#F1F5F9", borderRadius: 12, padding: 14, fontSize: 16, color: "#1E293B", borderWidth: 1, borderColor: "#E2E8F0" },
  mainBtn: { flexDirection: 'row', paddingVertical: 16, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 8 },
  editBtn: { backgroundColor: "#0EA5E9" },
  saveBtn: { backgroundColor: "#10B981" },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  logoutBtn: { flexDirection: 'row', marginTop: 16, padding: 16, borderRadius: 15, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FEE2E2', gap: 8 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});