import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import API from "../../src/services/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function PatientProfile() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const router = useRouter();
  const { token, role, login } = useAuth();

  const submitProfile = async () => {
    try {
      await API.post(
        "/profile/patient",
        {
          fullName,
          age,
          heightCm: height,
          baselineWeightKg: weight,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile saved");

      // ✅ Update AuthContext so AuthGate knows profile is completed
      await login(token!, role!, true);

      // Navigate to dashboard
      router.replace("/dashboard/patient");
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Patient Profile</Text>
          <Text style={styles.subtitle}>
            Please enter your medical details
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              onChangeText={setFullName}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25"
              keyboardType="numeric"
              onChangeText={setAge}
              placeholderTextColor="#999"
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="180"
                  keyboardType="numeric"
                  onChangeText={setHeight}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="75"
                  keyboardType="numeric"
                  onChangeText={setWeight}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={submitProfile}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});