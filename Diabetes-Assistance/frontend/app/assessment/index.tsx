import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { useRouter, Stack } from "expo-router";

export default function Assessment() {
  // KEPT ORIGINAL NAMES TO MATCH YOUR API
  const [weight, setWeight] = useState("");
  const [fasting, setFasting] = useState("");
  const [pp, setPP] = useState("");
  const [hba1c, setHba1c] = useState("");

  const [footUlcer, setFootUlcer] = useState(false);
  const [neuropathy, setNeuropathy] = useState(false);

  const [urineGlucose, setUrineGlucose] = useState("+");
  const [urineKetone, setUrineKetone] = useState("+");

  const [preDiabetes, setPreDiabetes] = useState(false);
  const [preDuration, setPreDuration] = useState("<1yr");

  const [diabetes, setDiabetes] = useState(false);
  const [diabetesDuration, setDiabetesDuration] = useState("<1yr");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const calculateBMI = () => {
    const heightCm = 170; // Placeholder
    const heightM = heightCm / 100;
    return (Number(weight) / (heightM * heightM)).toFixed(1);
  };

  const submitAssessment = async () => {
    if (!weight || !fasting || !pp || !hba1c) {
      Alert.alert("Error", "Please fill all required medical values.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const bmi = calculateBMI();

      // KEYS REMAIN UNCHANGED TO PROTECT API FUNCTIONALITY
      const res = await API.post(
        "/assessment",
        {
          weightKg: Number(weight),
          bmi: Number(bmi),
          fastingSugar: Number(fasting),
          postPrandialSugar: Number(pp),
          hba1c: Number(hba1c),
          footUlcer,
          neuropathy,
          urineGlucose,
          urineKetone,
          preDiabetesPresent: preDiabetes,
          preDiabetesDuration: preDiabetes ? preDuration : null,
          diabetesPresent: diabetes,
          diabetesDuration: diabetes ? diabetesDuration : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.replace(`/assessment/result?risk=${res.data.riskLevel}` as any);
    } catch (error: any) {
      // Improved error logging to help you debug
      const errorMsg = error?.response?.data?.message || "Check your internet or API logs.";
      Alert.alert("Submission Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const Selector = ({ options, value, setValue }: any) => (
    <View style={styles.optionRow}>
      {options.map((item: string) => (
        <TouchableOpacity
          key={item}
          onPress={() => setValue(item)}
          style={[styles.miniBtn, value === item && styles.miniBtnActive]}
        >
          <Text style={[styles.miniBtnText, value === item && styles.miniBtnTextActive]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* ================= UPDATED HEADER ================= */}
      <Stack.Screen 
        options={{
          title: "Health Assessment",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
              <Ionicons name="chevron-back" size={26} color="#0F172A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Risk Analysis</Text>
        <Text style={styles.subtitle}>Fill in your current medical readings</Text>

        {/* --- Metrics Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Blood & Weight</Text>
          
          <Text style={styles.fieldLabel}>Weight (kg)</Text>
          <TextInput placeholder="70" keyboardType="numeric" value={weight} onChangeText={setWeight} style={styles.input} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fieldLabel}>Fasting</Text>
              <TextInput placeholder="mg/dL" keyboardType="numeric" value={fasting} onChangeText={setFasting} style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>PP Sugar</Text>
              <TextInput placeholder="mg/dL" keyboardType="numeric" value={pp} onChangeText={setPP} style={styles.input} />
            </View>
          </View>

          <Text style={styles.fieldLabel}>HbA1c (%)</Text>
          <TextInput placeholder="6.5" keyboardType="numeric" value={hba1c} onChangeText={setHba1c} style={styles.input} />
        </View>

        {/* --- Urine Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Urine Tests</Text>
          <Text style={styles.innerLabel}>Urine Glucose</Text>
          <Selector options={["+", "++", "+++", "++++"]} value={urineGlucose} setValue={setUrineGlucose} />
          
          <Text style={[styles.innerLabel, { marginTop: 10 }]}>Urine Ketone</Text>
          <Selector options={["+", "++", "+++", "++++"]} value={urineKetone} setValue={setUrineKetone} />
        </View>

        {/* --- Conditions Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Symptoms & History</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Pre-Diabetes</Text>
            <Switch value={preDiabetes} onValueChange={setPreDiabetes} trackColor={{ true: "#BAE6FD" }} thumbColor={preDiabetes ? "#0EA5E9" : "#f4f3f4"} />
          </View>
          {preDiabetes && <Selector options={["<1yr", "1-5yr", "6-10yr", ">10yr"]} value={preDuration} setValue={setPreDuration} />}

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Diabetes</Text>
            <Switch value={diabetes} onValueChange={setDiabetes} trackColor={{ true: "#BAE6FD" }} thumbColor={diabetes ? "#0EA5E9" : "#f4f3f4"} />
          </View>
          {diabetes && <Selector options={["<1yr", "1-5yr", "6-10yr", ">10yr"]} value={diabetesDuration} setValue={setDiabetesDuration} />}

          <View style={styles.switchRow}><Text style={styles.switchText}>Foot Ulcer</Text><Switch value={footUlcer} onValueChange={setFootUlcer} /></View>
          <View style={styles.switchRow}><Text style={styles.switchText}>Neuropathy</Text><Switch value={neuropathy} onValueChange={setNeuropathy} /></View>
        </View>

        <TouchableOpacity 
          onPress={submitAssessment} 
          disabled={loading} 
          style={[styles.btn, loading && { opacity: 0.6 }]}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Analyze Health Risk</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  backIcon: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", marginBottom: 20 },
  card: { backgroundColor: "white", borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#334155", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingBottom: 8 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#94A3B8", marginBottom: 5, textTransform: 'uppercase' },
  innerLabel: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: { backgroundColor: "#F1F5F9", borderRadius: 10, padding: 12, fontSize: 16, color: "#1E293B", marginBottom: 15, borderWidth: 1, borderColor: "#E2E8F0" },
  row: { flexDirection: "row" },
  optionRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  miniBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#F1F5F9", borderRadius: 8, marginRight: 8, marginBottom: 8 },
  miniBtnActive: { backgroundColor: "#0EA5E9" },
  miniBtnText: { color: "#475569", fontWeight: "600" },
  miniBtnTextActive: { color: "white" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  switchText: { fontSize: 16, fontWeight: "500", color: "#1E293B" },
  btn: { backgroundColor: "#0EA5E9", padding: 18, borderRadius: 15, alignItems: "center", marginTop: 10 },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});