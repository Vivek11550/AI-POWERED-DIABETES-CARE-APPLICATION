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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../src/services/api";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function DoctorProfile() {
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token, role, login } = useAuth();

  const submitProfile = async () => {
    // Basic Validation for required fields
    if (!fullName || !specialization || !qualification) {
      alert("Please fill in Name, Qualification, and Specialization.");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        "/profile/doctor",
        {
          fullName,
          specialization,
          qualification,
          registrationNumber, // Optional
          phone, // Optional
          experienceYears: experienceYears ? Number(experienceYears) : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile saved successfully");
      await login(token!, role!, true);
      router.replace("/dashboard/doctor");
    } catch (err: any) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen 
        options={{
          title: "Doctor Profile",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="medical" size={32} color="#FFF" />
            </View>
            <Text style={styles.title}>Professional Setup</Text>
            <Text style={styles.subtitle}>Complete your profile to start managing patients</Text>
          </View>

          <View style={styles.card}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Dr. John Doe"
              onChangeText={setFullName}
              placeholderTextColor="#94A3B8"
            />

            {/* Qualification & Specialization */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Qualification *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MBBS, MD"
                  onChangeText={setQualification}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Experience</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Years"
                  keyboardType="numeric"
                  onChangeText={setExperienceYears}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={styles.label}>Specialization *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Diabetologist"
              onChangeText={setSpecialization}
              placeholderTextColor="#94A3B8"
            />

            {/* Optional Fields */}
            <View style={styles.divider} />
            
            <Text style={styles.label}>Registration No (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. MC-12345"
              onChangeText={setRegistrationNumber}
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Contact Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 00000 00000"
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={submitProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Complete Profile</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20 },
  headerSection: { alignItems: 'center', marginBottom: 25 },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", textAlign: 'center', marginTop: 5 },
  card: {
    backgroundColor: "#FFF", borderRadius: 24, padding: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  label: { fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0",
    borderRadius: 12, padding: 14, fontSize: 16, color: "#1E293B", marginBottom: 15,
  },
  row: { flexDirection: "row" },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  button: {
    backgroundColor: "#0F172A", paddingVertical: 18, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginTop: 25, elevation: 4,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});