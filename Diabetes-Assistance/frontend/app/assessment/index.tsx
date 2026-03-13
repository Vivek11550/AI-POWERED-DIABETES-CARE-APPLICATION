import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { useRouter } from "expo-router";

export default function Assessment() {
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
    const heightCm = 170;
    const heightM = heightCm / 100;
    return (Number(weight) / (heightM * heightM)).toFixed(1);
  };

  const validateForm = () => {
    if (!weight || !fasting || !pp || !hba1c) {
      Alert.alert("Error", "Please fill all required medical values.");
      return false;
    }

    if (Number(weight) <= 0) {
      Alert.alert("Error", "Weight must be greater than 0.");
      return false;
    }

    return true;
  };

  const submitAssessment = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      const bmi = calculateBMI();

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.replace(`/assessment/result?risk=${res.data.riskLevel}` as any);
    } catch (error: any) {
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const DurationOptions = ({ value, setValue }: any) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
      {["<1yr", "1-5yr", "6-10yr", ">10yr"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => setValue(item)}
          style={{
            padding: 8,
            margin: 4,
            backgroundColor: value === item ? "#2563eb" : "#e5e7eb",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: value === item ? "white" : "black" }}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const UrineOptions = ({ value, setValue }: any) => (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      {["+", "++", "+++", "++++"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => setValue(item)}
          style={{
            padding: 8,
            margin: 4,
            backgroundColor: value === item ? "#2563eb" : "#e5e7eb",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: value === item ? "white" : "black" }}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15 }}>
        Health Assessment
      </Text>

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Fasting Sugar (mg/dL)"
        keyboardType="numeric"
        value={fasting}
        onChangeText={setFasting}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Post Prandial Sugar (mg/dL)"
        keyboardType="numeric"
        value={pp}
        onChangeText={setPP}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TextInput
        placeholder="HbA1c (%)"
        keyboardType="numeric"
        value={hba1c}
        onChangeText={setHba1c}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Text style={{ fontWeight: "600" }}>Urine Glucose</Text>
      <UrineOptions value={urineGlucose} setValue={setUrineGlucose} />

      <Text style={{ fontWeight: "600" }}>Urine Ketone</Text>
      <UrineOptions value={urineKetone} setValue={setUrineKetone} />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Pre-Diabetes</Text>
        <Switch value={preDiabetes} onValueChange={setPreDiabetes} />
      </View>

      {preDiabetes && (
        <DurationOptions value={preDuration} setValue={setPreDuration} />
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Diabetes</Text>
        <Switch value={diabetes} onValueChange={setDiabetes} />
      </View>

      {diabetes && (
        <DurationOptions
          value={diabetesDuration}
          setValue={setDiabetesDuration}
        />
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Foot Ulcer</Text>
        <Switch value={footUlcer} onValueChange={setFootUlcer} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Neuropathy</Text>
        <Switch value={neuropathy} onValueChange={setNeuropathy} />
      </View>

      <TouchableOpacity
        onPress={submitAssessment}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9ca3af" : "#2563eb",
          padding: 15,
          borderRadius: 8,
          marginTop: 25,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
            Analyze Risk
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
