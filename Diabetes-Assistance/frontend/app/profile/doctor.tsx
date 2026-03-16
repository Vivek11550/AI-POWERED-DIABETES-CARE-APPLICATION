import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileTitle from "../../components/profile/ProfileTitle";
import InfoSection from "../../components/profile/InfoSection";
import InfoRow from "../../components/profile/InfoRow";
import { useAuth } from "@/src/context/AuthContext";

export default function DoctorProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/profile/doctor/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await API.put("/profile/doctor", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
      setEdit(false);
    } catch (error) {
      alert("Error saving profile");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* ================= HEADER CONFIG ================= */}
      <Stack.Screen 
        options={{
          title: "My Professional Profile",
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER SECTION ================= */}
        <View style={styles.headerCard}>
          <ProfileAvatar />
          <ProfileTitle
            name={profile.fullName || "Doctor"}
            subtitle={profile.specialization || "Medical Specialist"}
          />
        </View>

        <View style={styles.contentContainer}>
          {/* ================= PROFESSIONAL SECTION ================= */}
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="ribbon-outline" size={20} color="#0F172A" />
              <Text style={styles.sectionLabel}>Professional Credentials</Text>
            </View>
            
            {edit ? (
              <>
                <EditableField label="Full Name" value={profile.fullName} onChange={(v) => setProfile({ ...profile, fullName: v })} />
                <EditableField label="Qualification" value={profile.qualification} onChange={(v) => setProfile({ ...profile, qualification: v })} />
                <EditableField label="Specialization" value={profile.specialization} onChange={(v) => setProfile({ ...profile, specialization: v })} />
                <EditableField label="Experience (Years)" value={String(profile.experienceYears || "")} keyboardType="numeric" onChange={(v) => setProfile({ ...profile, experienceYears: v })} />
                <EditableField label="Registration No." value={profile.registrationNumber} onChange={(v) => setProfile({ ...profile, registrationNumber: v })} />
              </>
            ) : (
              <>
                <InfoRow label="Full Name" value={profile.fullName || "-"} />
                <InfoRow label="Qualification" value={profile.qualification || "-"} />
                <InfoRow label="Specialization" value={profile.specialization || "-"} />
                <InfoRow label="Experience" value={profile.experienceYears ? `${profile.experienceYears} Years` : "-"} />
                <InfoRow label="Registration No." value={profile.registrationNumber || "Not Provided"} />
              </>
            )}
          </View>

          {/* ================= CONTACT SECTION ================= */}
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="call-outline" size={20} color="#0F172A" />
              <Text style={styles.sectionLabel}>Contact Details</Text>
            </View>
            
            {edit ? (
              <>
                <EditableField label="Phone Number" value={profile.phone} keyboardType="phone-pad" onChange={(v) => setProfile({ ...profile, phone: v })} />
              </>
            ) : (
              <>
                <InfoRow label="Official Email" value={profile.email || "-"} />
                <InfoRow label="Contact Phone" value={profile.phone || "Not Provided"} />
              </>
            )}
          </View>

          {/* ================= ACTIONS ================= */}
          <TouchableOpacity 
            style={[styles.mainBtn, edit ? styles.saveBtn : styles.editBtn]} 
            onPress={edit ? saveProfile : () => setEdit(true)}
          >
            <Ionicons name={edit ? "save-outline" : "create-outline"} size={20} color="#FFF" />
            <Text style={styles.btnText}>{edit ? "Save Professional Details" : "Edit Profile"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout from System</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= EDITABLE INPUT COMPONENT ================= */

function EditableField({ label, value, onChange, placeholder, keyboardType = "default" }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder || `Enter ${label}`}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginLeft: 10, padding: 5 },
  headerCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  contentContainer: { padding: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginLeft: 8 },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 5, textTransform: 'uppercase' },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mainBtn: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  editBtn: { backgroundColor: "#0F172A" },
  saveBtn: { backgroundColor: "#10B981" },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  logoutBtn: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});