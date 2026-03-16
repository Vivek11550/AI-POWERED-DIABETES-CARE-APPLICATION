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
import { Ionicons } from "@expo/vector-icons";
import API from "../../src/services/api";
import { RelativePathString, useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

/* ================= TYPES ================= */

type OptionProps = {
  label: string;
  value: string;
  selected: string;
  onSelect: (value: string) => void;
};

/* ================= COMPONENT ================= */

export default function PatientProfile() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [diet, setDiet] = useState("");

  const router = useRouter();
  const { token, role, login } = useAuth();

  /* ================= OPTION COMPONENT ================= */

  const Option = ({ label, value, selected, onSelect }: OptionProps) => (
    <TouchableOpacity
      style={[styles.option, selected === value && styles.optionSelected]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <Text style={[styles.optionText, selected === value && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, icon }: { title: string; icon: any }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#0EA5E9" style={{ marginRight: 8 }} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  /* ================= SUBMIT ================= */

  const submitProfile = async () => {
    try {
      if (phone && phone.length < 10) {
        alert("Please enter valid phone number");
        return;
      }

      await API.post(
        "/profile/patient",
        {
          fullName,
          phone,
          age,
          heightCm: height,
          baselineWeightKg: weight,
          gender,
          education,
          occupation,
          diet,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile saved successfully");
      await login(token!, role!, true);
      router.replace("/quiz" as RelativePathString);
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>Help us personalize your diabetic care plan</Text>

          <View style={styles.formCard}>
            
            {/* --- Section 1: Personal --- */}
            <SectionHeader title="Personal Information" icon="person-outline" />
            
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              onChangeText={setFullName}
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 00000 00000"
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />

            {/* --- Section 2: Physical Metrics --- */}
            <SectionHeader title="Physical Metrics" icon="fitness-outline" />
            
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yrs"
                  keyboardType="numeric"
                  onChangeText={setAge}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  placeholder="cm"
                  keyboardType="numeric"
                  onChangeText={setHeight}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kg"
                  keyboardType="numeric"
                  onChangeText={setWeight}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.optionRow}>
              {['Male', 'Female', 'Other'].map((item) => (
                <Option key={item} label={item} value={item.toLowerCase()} selected={gender} onSelect={setGender} />
              ))}
            </View>

            {/* --- Section 3: Socio-Economic --- */}
            <SectionHeader title="Lifestyle & Background" icon="leaf-outline" />

            <Text style={styles.label}>Dietary Preference</Text>
            <View style={styles.optionRow}>
              <Option label="Vegetarian" value="veg" selected={diet} onSelect={setDiet} />
              <Option label="Non-Veg" value="nonveg" selected={diet} onSelect={setDiet} />
            </View>

            <Text style={styles.label}>Education</Text>
            <View style={styles.optionWrap}>
              {['Illiterate', 'Primary', 'Secondary', 'Higher Sec', 'Graduation+'].map((edu) => (
                <Option key={edu} label={edu} value={edu.toLowerCase().replace(' ', '_')} selected={education} onSelect={setEducation} />
              ))}
            </View>

            <Text style={styles.label}>Occupation</Text>
            <View style={styles.optionWrap}>
              {['Private', 'Government', 'Farmer', 'Housewife', 'Student'].map((occ) => (
                <Option key={occ} label={occ} value={occ.toLowerCase()} selected={occupation} onSelect={setOccupation} />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={submitProfile}>
            <Text style={styles.buttonText}>Save & Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  optionSelected: {
    backgroundColor: "#0EA5E9",
    borderColor: "#0EA5E9",
  },
  optionText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#FFF",
  },
  button: {
    backgroundColor: "#0EA5E9",
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 30,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});