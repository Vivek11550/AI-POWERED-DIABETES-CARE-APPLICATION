import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
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

  const router = useRouter();

  const calculateBMI = () => {
    const heightCm = 170; // from profile later
    const heightM = heightCm / 100;
    return (Number(weight) / (heightM * heightM)).toFixed(1);
  };

  const submitAssessment = async () => {
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
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.replace(
      `/assessment/result?risk=${res.data.riskLevel}` as any
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Health Assessment
      </Text>

      <TextInput
        placeholder="Current Weight (kg)"
        keyboardType="numeric"
        onChangeText={setWeight}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Fasting Sugar (mg/dL)"
        keyboardType="numeric"
        onChangeText={setFasting}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Post Prandial Sugar (mg/dL)"
        keyboardType="numeric"
        onChangeText={setPP}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="HbA1c (%)"
        keyboardType="numeric"
        onChangeText={setHba1c}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Foot Ulcer</Text>
        <Switch value={footUlcer} onValueChange={setFootUlcer} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Numbness / Neuropathy</Text>
        <Switch value={neuropathy} onValueChange={setNeuropathy} />
      </View>

      <TouchableOpacity
        onPress={submitAssessment}
        style={{
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Analyze Risk
        </Text>
      </TouchableOpacity>
    </View>
  );
}
