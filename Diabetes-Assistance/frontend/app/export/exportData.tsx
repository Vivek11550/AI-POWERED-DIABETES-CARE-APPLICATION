import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileTitle from "../../components/profile/ProfileTitle";
import InfoRow from "../../components/profile/InfoRow";
import { useAuth } from "@/src/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/src/context/LanguageContext";

export default function patientProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

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

      alert(t("patientProfile1.success"));
      setEdit(false);
    } catch (error) {
      alert(t("patientProfile1.error"));
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
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: t("patientProfile1.header"),
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { color: "#0F172A", fontWeight: "700" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color="#0F172A" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.headerCard}>
          <ProfileAvatar />

          <ProfileTitle
            name={profile.fullName || t("patientProfile1.defaultName")}
            subtitle={profile.specialization || t("patientProfile1.defaultSpecialization")}
          />
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="ribbon-outline" size={20} color="#0F172A" />
              <Text style={styles.sectionLabel}>{t("patientProfile1.credentials")}</Text>
            </View>

            {edit ? (
              <>
                <EditableField
                  label={t("patientProfile1.fullName")}
                  value={profile.fullName}
                  onChange={(v: any) => setProfile({ ...profile, fullName: v })}
                />

                <EditableField
                  label={t("patientProfile1.qualification")}
                  value={profile.qualification}
                  onChange={(v: any) => setProfile({ ...profile, qualification: v })}
                />

                <EditableField
                  label={t("patientProfile1.specialization")}
                  value={profile.specialization}
                  onChange={(v: any) => setProfile({ ...profile, specialization: v })}
                />

                <EditableField
                  label={t("patientProfile1.experience")}
                  value={String(profile.experienceYears || "")}
                  keyboardType="numeric"
                  onChange={(v: any) => setProfile({ ...profile, experienceYears: v })}
                />

                <EditableField
                  label={t("patientProfile1.regNo")}
                  value={profile.registrationNumber}
                  onChange={(v: any) => setProfile({ ...profile, registrationNumber: v })}
                />
              </>
            ) : (
              <>
                <InfoRow label={t("patientProfile1.fullName")} value={profile.fullName || "-"} />
                <InfoRow label={t("patientProfile1.qualification")} value={profile.qualification || "-"} />
                <InfoRow label={t("patientProfile1.specialization")} value={profile.specialization || "-"} />
                <InfoRow
                  label={t("patientProfile1.experience")}
                  value={
                    profile.experienceYears
                      ? `${profile.experienceYears} ${t("patientProfile1.years")}`
                      : "-"
                  }
                />
                <InfoRow
                  label={t("patientProfile1.regNo")}
                  value={profile.registrationNumber || t("patientProfile1.notProvided")}
                />
              </>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="call-outline" size={20} color="#0F172A" />
              <Text style={styles.sectionLabel}>{t("patientProfile1.contactSection")}</Text>
            </View>

            {edit ? (
              <EditableField
                label={t("patientProfile1.contact")}
                value={profile.phone}
                keyboardType="phone-pad"
                onChange={(v: any) => setProfile({ ...profile, phone: v })}
              />
            ) : (
              <>
                <InfoRow label={t("patientProfile1.email")} value={profile.email || "-"} />
                <InfoRow
                  label={t("patientProfile1.contact")}
                  value={profile.phone || t("patientProfile1.notProvided")}
                />
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.mainBtn, edit ? styles.saveBtn : styles.editBtn]}
            onPress={edit ? saveProfile : () => setEdit(true)}
          >
            <Ionicons
              name={edit ? "save-outline" : "create-outline"}
              size={20}
              color="#FFF"
            />
            <Text style={styles.btnText}>
              {edit ? t("patientProfile1.save") : t("patientProfile1.edit")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t("patientProfile1.logout")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EditableField({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}: any) {
  const { t } = useLanguage();

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        placeholder={placeholder || `${t("patientProfile1.enter")} ${label}`}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    marginLeft: Platform.OS === "ios" ? 0 : 5,
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  contentContainer: {
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 8,
  },

  inputGroup: { marginBottom: 15 },

  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 5,
    textTransform: "uppercase",
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
    flexDirection: "row",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
  },

  editBtn: { backgroundColor: "#0F172A" },

  saveBtn: { backgroundColor: "#10B981" },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutBtn: {
    flexDirection: "row",
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    gap: 8,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 16,
  },
});