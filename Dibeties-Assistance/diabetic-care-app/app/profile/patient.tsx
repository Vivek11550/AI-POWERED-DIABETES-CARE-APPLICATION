import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import API from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function PatientProfile() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const router = useRouter();

  const submitProfile = async () => {
    const token = await AsyncStorage.getItem("token");

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
      router.replace("/dashboard/patient" as any);
    } catch (err: any) {
      alert("Error saving profile");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Patient Profile</Text>

      <TextInput placeholder="Full Name" onChangeText={setFullName} />
      <TextInput placeholder="Age" keyboardType="numeric" onChangeText={setAge} />
      <TextInput placeholder="Height (cm)" keyboardType="numeric" onChangeText={setHeight} />
      <TextInput placeholder="Weight (kg)" keyboardType="numeric" onChangeText={setWeight} />

      <Button title="Save Profile" onPress={submitProfile} />
    </View>
  );
}
