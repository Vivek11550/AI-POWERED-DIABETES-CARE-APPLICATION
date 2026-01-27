import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const router = useRouter();

  const register = async () => {
    try {
      await API.post(AUTH.REGISTER, {
        email,
        password,
        role,
      });

      alert("Registered successfully");
      router.replace("/(auth)/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Registration failed";
      alert(message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Text>Select Role</Text>
      <Button title="Patient" onPress={() => setRole("patient")} />
      <Button title="Doctor" onPress={() => setRole("doctor")} />

      <Button title="Register" onPress={register} />
    </View>
  );
}
