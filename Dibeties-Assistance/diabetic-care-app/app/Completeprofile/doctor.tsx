import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import API from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function DoctorProfile() {
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const router = useRouter();

  const submitProfile = async () => {
    const token = await AsyncStorage.getItem("token");

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
      router.replace("/dashboard/doctor" as any);
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Doctor Profile</Text>

      <TextInput placeholder="Full Name" onChangeText={setFullName} />
      <TextInput placeholder="Specialization" onChangeText={setSpecialization} />
      <TextInput placeholder="Registration Number" onChangeText={setRegistrationNumber} />

      <Button title="Save Profile" onPress={submitProfile} />
    </View>
  );
}
