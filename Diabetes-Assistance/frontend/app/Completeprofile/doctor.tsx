import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import API from "../../src/services/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function DoctorProfile() {
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const router = useRouter();
  const { token, role, login } = useAuth();

  const submitProfile = async () => {
    try {
      await API.post(
        "/profile/doctor",
        {
          fullName,
          specialization,
          registrationNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile saved");

      // ✅ Update AuthContext
      await login(token!, role!, true);

      // Navigate to dashboard
      router.replace("/dashboard/doctor");

    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Specialization"
        onChangeText={setSpecialization}
      />

      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        onChangeText={setRegistrationNumber}
      />

      <Button title="Save Profile" onPress={submitProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});