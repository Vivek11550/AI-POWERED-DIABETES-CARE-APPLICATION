import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import { useAuth } from "@/src/context/AuthContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Login() {
  const router = useRouter();

  const { login: saveLogin } = useAuth();
  const { t } = useLanguage();

  console.log("Login render");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(AUTH.LOGIN, {
        email,
        password,
      });

      alert("Login successful");

      await saveLogin(
        res.data.token,
        res.data.role,
        res.data.profileCompleted
      );

      // ❗ No navigation here
      // AuthGate in _layout.tsx handles redirect automatically
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.langSwitch}>
        <LanguageSwitcher />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.welcome}>{t("auth.welcomeBack")}</Text>

          <Image
            source={require("../../assets/images/bvdu-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Effectiveness of AI based Nurse led Program on Patients with
            Diabetes mellitus management
          </Text>

          <Text style={styles.label}>{t("auth.emailLabel")}</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder={t("auth.emailPlaceholder")}
          />

          <Text style={styles.label}>{t("auth.passwordLabel")}</Text>

          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder={t("auth.passwordPlaceholder")}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>{t("auth.loginButton")}</Text>
            )}
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