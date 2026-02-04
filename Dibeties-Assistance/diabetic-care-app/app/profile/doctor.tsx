import {
  ScrollView,
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

export default function DoctorProfile() {
  const [profile, setProfile] = useState<any>({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/profile/doctor/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data);
  };


  const saveProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    await API.put("/profile/doctor", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEdit(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* ================= HEADER ================= */}
      <ProfileAvatar />
      <ProfileTitle
        name={profile.fullName || "Doctor"}
        subtitle={profile.specialization || "Specialist"}
      />

      {/* ================= PROFESSIONAL INFO ================= */}
      <InfoSection title="Professional Information">
        {edit ? (
          <>
            <EditableField
              placeholder="Full Name"
              value={profile.fullName || ""}
              onChange={(v) =>
                setProfile({ ...profile, fullName: v })
              }
            />
            <EditableField
              placeholder="Specialization"
              value={profile.specialization || ""}
              onChange={(v) =>
                setProfile({
                  ...profile,
                  specialization: v,
                })
              }
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Full Name"
              value={profile.fullName || "-"}
            />
            <InfoRow
              label="Specialization"
              value={profile.specialization || "-"}
            />
          </>
        )}
      </InfoSection>

      {/* ================= CONTACT ================= */}
      <InfoSection title="Contact Information">
        <InfoRow
          label="Email"
          value={profile.email || "-"}
        />
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
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
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
