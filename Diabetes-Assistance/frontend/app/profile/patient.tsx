import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileTitle from "../../components/profile/ProfileTitle";
import InfoSection from "../../components/profile/InfoSection";
import InfoRow from "../../components/profile/InfoRow";
import EditProfileButton from "../../components/profile/EditProfileButton";

export default function PatientProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/profile/patient/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data);
  };

  const saveProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    await API.put("/profile/patient", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEdit(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* ================= HEADER ================= */}
      <ProfileAvatar />
      <ProfileTitle
        name={profile.fullName || "Patient"}
        subtitle="Patient"
      />

      {/* ================= PERSONAL INFO ================= */}
      <InfoSection title="Personal Information">
        {edit ? (
          <>
            <EditableField
              placeholder="Full Name"
              value={profile.fullName || ""}
              onChange={(v: any) =>
                setProfile({ ...profile, fullName: v })
              }
            />
            <EditableField
              placeholder="Age"
              value={
                profile.age ? String(profile.age) : ""
              }
              onChange={(v: any) =>
                setProfile({ ...profile, age: v })
              }
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Full Name"
              value={profile.fullName || "-"}
            />
            <InfoRow
              label="Age"
              value={
                profile.age ? String(profile.age) : "-"
              }
            />
          </>
        )}
      </InfoSection>

      {/* ================= HEALTH INFO ================= */}
      <InfoSection title="Health Information">
        {edit ? (
          <>
            <EditableField
              placeholder="Height (cm)"
              value={
                profile.heightCm
                  ? String(profile.heightCm)
                  : ""
              }
              onChange={(v: any) =>
                setProfile({
                  ...profile,
                  heightCm: v,
                })
              }
              keyboardType="numeric"
            />
            <EditableField
              placeholder="Weight (kg)"
              value={
                profile.baselineWeightKg
                  ? String(profile.baselineWeightKg)
                  : ""
              }
              onChange={(v: any) =>
                setProfile({
                  ...profile,
                  baselineWeightKg: v,
                })
              }
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Height"
              value={
                profile.heightCm
                  ? `${profile.heightCm} cm`
                  : "-"
              }
            />
            <InfoRow
              label="Weight"
              value={
                profile.baselineWeightKg
                  ? `${profile.baselineWeightKg} kg`
                  : "-"
              }
            />
          </>
        )}
      </InfoSection>

      {/* ================= ACTION ================= */}
      <EditProfileButton
        title={edit ? "Save Profile" : "Edit Profile"}
        onPress={edit ? saveProfile : () => setEdit(true)}
      />
    </ScrollView>
  );
}

/* ================= EDITABLE INPUT ================= */

function EditableField({
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}: any) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onChangeText={onChange}
      style={styles.input}
    />
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
});
