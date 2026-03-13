import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Login() {
  const router = useRouter();

  // ✅ Language context
  const { t } = useLanguage();
  console.log("Login render");

  // 🔹 Core login state (UNCHANGED)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Login logic (UNCHANGED)
  const login = async () => {
    try {


      const res = await API.post(AUTH.LOGIN, {
        email,
        password,
      });

      alert("Login successful");

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("role", res.data.role);



      if (!res.data.profileCompleted) {
        if (res.data.role === "patient") {
          router.replace("/Completeprofile/patient" as any);
        } else {
          router.replace("/Completeprofile/doctor" as any);
        }
      } else {
        if (res.data.role === "patient") {
          router.replace("/dashboard/patient" as any);
        }
        else if (res.data.role === "admin") {
          router.replace("/admin/createDoctor" as any);
        }
        else {
          router.replace("/dashboard/doctor" as any);
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  return (
    <View style={styles.root}>
      {/* 🔹 Language Switcher (top layer) */}
      <View style={styles.langSwitch}>
        <LanguageSwitcher />
      </View>

      {/* 🔹 Centered content */}
      <View style={styles.container}>

        <View style={styles.card} >
          <Text style={styles.welcome}>
            {t("auth.welcomeBack")}
          </Text>

          <Image
            source={require("../../assets/images/bvdu-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Effectiveness of AI based Nurse led Program on Patients with Diabetes mellitus management
          </Text>

          <Text style={styles.label}>
            {t("auth.emailLabel")}
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder={t("auth.emailPlaceholder")}
          />

          <Text style={styles.label}>
            {t("auth.passwordLabel")}
          </Text>

          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder={t("auth.passwordPlaceholder")}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={login}>
            <Text style={styles.loginText}>
              {t("auth.loginButton")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerText}>
              {t("auth.goToRegister")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F6FAF7",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  langSwitch: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },

  welcome: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 24,
  },

  logo: {
    height: 90,
    width: "100%",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#2E4E3F",
  },

  input: {
    backgroundColor: "#F2F4F6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },

  loginBtn: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#1F3D2B",
    fontSize: 16,
    fontWeight: "600",
  },

  registerText: {
    textAlign: "center",
    marginTop: 16,
    color: "#0ea5e9",
  },
});
