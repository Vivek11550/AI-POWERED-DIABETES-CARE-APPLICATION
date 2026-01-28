import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";



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
  
}
else{
    if (res.data.role === "patient") {
    router.replace("/dashboard/patient" as any);
  } else {
    router.replace("/dashboard/doctor" as any);
  }
  }
      // save token → redirect based on role
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed";
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

      <Button title="Login" onPress={login} />

      <Button
        title="Go to Register"
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
}
