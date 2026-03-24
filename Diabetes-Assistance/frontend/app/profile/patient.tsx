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
import { useLanguage } from "@/src/context/LanguageContext";

import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileTitle from "../../components/profile/ProfileTitle";
import InfoRow from "../../components/profile/InfoRow";

export default function patientProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
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
      alert(t("patientProfile1.success"));
      setEdit(false);
      loadProfile();
    } catch (error) {
      alert(t("patientProfile1.error"));
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
          title: t("patientProfile1.header"),
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
            colors={["#0EA5E9"]}
            tintColor="#0EA5E9"
          />
        }
      >
        <View style={styles.headerSection}>
          <ProfileAvatar />
          <ProfileTitle
            name={profile.fullName || t("patientProfile1.defaultName")}
            subtitle={t("patientProfile1.subtitle")}
          />
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>{t("patientProfile1.personal")}</Text>
            </View>
            
            {edit ? (
              <>
                <EditableField label={t("patientProfile1.fullName")} value={profile.fullName} onChange={(v: string) => setProfile({ ...profile, fullName: v })} />
                <EditableField label={t("patientProfile1.age")} value={String(profile.age || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, age: v })} />
                <EditableField label={t("patientProfile1.phone")} value={profile.phone} keyboardType="phone-pad" onChange={(v: string) => setProfile({ ...profile, phone: v })} />
              </>
            ) : (
              <>
                <InfoRow label={t("patientProfile1.fullName")} value={profile.fullName || "-"} />
                <InfoRow label={t("patientProfile1.age")} value={profile.age ? `${profile.age} ${t("patientProfile1.years")}` : "-"} />
                <InfoRow label={t("patientProfile1.phone")} value={profile.phone || "-"} />
                <InfoRow label={t("patientProfile1.gender")} value={profile.gender || "-"} />
              </>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="fitness-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>{t("patientProfile1.health")}</Text>
            </View>

            {edit ? (
              <>
                <EditableField label={t("patientProfile1.height")} value={String(profile.heightCm || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, heightCm: v })} />
                <EditableField label={t("patientProfile1.weight")} value={String(profile.baselineWeightKg || "")} keyboardType="numeric" onChange={(v: string) => setProfile({ ...profile, baselineWeightKg: v })} />
              </>
            ) : (
              <>
                <InfoRow label={t("patientProfile1.height")} value={profile.heightCm ? `${profile.heightCm} cm` : "-"} />
                <InfoRow label={t("patientProfile1.weight")} value={profile.baselineWeightKg ? `${profile.baselineWeightKg} kg` : "-"} />
                <InfoRow label={t("patientProfile1.diet")} value={profile.diet === 'veg' ? t("patientProfile1.veg") : t("patientProfile1.nonveg")} />
              </>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="school-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionLabel}>{t("patientProfile1.background")}</Text>
            </View>

            {edit ? (
              <>
                <EditableField label={t("patientProfile1.education")} value={profile.education} onChange={(v: string) => setProfile({ ...profile, education: v })} />
                <EditableField label={t("patientProfile1.occupation")} value={profile.occupation} onChange={(v: string) => setProfile({ ...profile, occupation: v })} />
              </>
            ) : (
              <>
                <InfoRow label={t("patientProfile1.education")} value={profile.education?.replace('_', ' ') || "-"} />
                <InfoRow label={t("patientProfile1.occupation")} value={profile.occupation || "-"} />
              </>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.mainBtn, edit ? styles.saveBtn : styles.editBtn]} 
            onPress={edit ? saveProfile : () => setEdit(true)}
          >
            <Ionicons name={edit ? "checkmark-circle" : "create"} size={20} color="#FFF" />
            <Text style={styles.btnText}>{edit ? t("patientProfile1.save") : t("patientProfile1.edit")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t("patientProfile1.logout")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function EditableField({ label, value, onChange, keyboardType = "default" }: any) {
  const { t } = useLanguage();

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={`${t("patientProfile1.enter")} ${label}`}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    marginTop:35
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#F8FAFC'
  },
  backBtn: {
    marginLeft: 10,
    padding: 8,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
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
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#0EA5E9",
  },
  saveBtn: {
    backgroundColor: "#10B981", // Green for saving
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutBtn: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
  },
});