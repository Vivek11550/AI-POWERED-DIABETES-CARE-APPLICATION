import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/src/i18n/i18n";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const res = await API.post(AUTH.LOGIN, {
        email,
        password,
      });

      alert("Login successful");
      console.log("LOGIN RESPONSE:", res.data);

      // NEXT STAGE 2 : (done)
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("role", res.data.role);

      if (!res.data.profileCompleted) {
        if (res.data.role === "patient") {
          router.replace("/profile/patient" as any);
        } else {
          router.replace("/profile/doctor" as any);
        }
      } else {
        if (res.data.role === "patient") {
          router.replace("/dashboard/patient" as any);
        } else {
          router.replace("/dashboard/doctor" as any);
        }
      }
      // save token → redirect based on role
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{i18n.t("auth.emailLabel")}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder={i18n.t("auth.emailPlaceholder")}
      />

      <Text>{i18n.t("auth.passwordLabel")}</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        placeholder={i18n.t("auth.passwordPlaceholder")}
      />

      <Button 
        title={i18n.t("auth.loginButton")} 
        onPress={login} 
      />

      <Button
        title={i18n.t("auth.goToRegister")}
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
}
