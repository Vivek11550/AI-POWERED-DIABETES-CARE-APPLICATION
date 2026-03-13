import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import { i18n } from "@/src/i18n/i18n";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "patient";
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
      <Text>{i18n.t("email")}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>{i18n.t("password")}</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Register" onPress={register} />
      <Text>Note: This registration is for patients only</Text>
    </View>
  );
}
