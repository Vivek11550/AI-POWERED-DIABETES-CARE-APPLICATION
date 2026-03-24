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
import { useLanguage } from "@/src/context/LanguageContext";

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
  const { t } = useLanguage();

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
        alert(t("patientProfile.invalidPhone"));
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

      alert(t("patientProfile.success"));
      await login(token!, role!, true);
      router.replace("/quiz" as RelativePathString);
    } catch (err) {
      alert(t("patientProfile.error"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>{t("patientProfile.title")}</Text>
          <Text style={styles.subtitle}>{t("patientProfile.subtitle")}</Text>

          <View style={styles.formCard}>
            
            <SectionHeader title={t("patientProfile.personal")} icon="person-outline" />
            
            <Text style={styles.label}>{t("patientProfile.fullName")}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              onChangeText={setFullName}
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>{t("patientProfile.phone")}</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 00000 00000"
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />

            <SectionHeader title={t("patientProfile.physical")} icon="fitness-outline" />
            
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.label}>{t("patientProfile.age")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yrs"
                  keyboardType="numeric"
                  onChangeText={setAge}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.label}>{t("patientProfile.height")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="cm"
                  keyboardType="numeric"
                  onChangeText={setHeight}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{t("patientProfile.weight")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kg"
                  keyboardType="numeric"
                  onChangeText={setWeight}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={styles.label}>{t("patientProfile.gender")}</Text>
            <View style={styles.optionRow}>
              {[
                { label: t("patientProfile.male"), value: "Male" },
                { label: t("patientProfile.female"), value: "Female" },
                { label: t("patientProfile.other"), value: "Other" },
              ].map((item) => (
                <Option key={item.value} label={item.label} value={item.value} selected={gender} onSelect={setGender} />
              ))}
            </View>

            <SectionHeader title={t("patientProfile.lifestyle")} icon="leaf-outline" />

            <Text style={styles.label}>{t("patientProfile.diet")}</Text>
            <View style={styles.optionRow}>
              <Option label={t("patientProfile.veg")} value="veg" selected={diet} onSelect={setDiet} />
              <Option label={t("patientProfile.nonveg")} value="nonveg" selected={diet} onSelect={setDiet} />
            </View>

            <Text style={styles.label}>{t("patientProfile.education")}</Text>
            <View style={styles.optionWrap}>
              {[
                { label: t("patientProfile.illiterate"), value: "Illiterate" },
                { label: t("patientProfile.primary"), value: "Primary" },
                { label: t("patientProfile.secondary"), value: "Secondary" },
                { label: t("patientProfile.higher"), value: "Higher Sec" },
                { label: t("patientProfile.graduation"), value: "Graduation+" },
              ].map((edu) => (
                <Option key={edu.value} label={edu.label} value={edu.value} selected={education} onSelect={setEducation} />
              ))}
            </View>

            <Text style={styles.label}>{t("patientProfile.occupation")}</Text>
            <View style={styles.optionWrap}>
              {[
                { label: t("patientProfile.private"), value: "Private" },
                { label: t("patientProfile.government"), value: "Government" },
                { label: t("patientProfile.farmer"), value: "Farmer" },
                { label: t("patientProfile.housewife"), value: "Housewife" },
                { label: t("patientProfile.student"), value: "Student" },
              ].map((occ) => (
                <Option key={occ.value} label={occ.label} value={occ.value} selected={occupation} onSelect={setOccupation} />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={submitProfile}>
            <Text style={styles.buttonText}>{t("patientProfile.saveBtn")}</Text>
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