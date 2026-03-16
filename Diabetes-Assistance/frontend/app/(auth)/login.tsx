import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import { useAuth } from "@/src/context/AuthContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Login() {
  const router = useRouter();
  const { login: saveLogin } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(AUTH.LOGIN, { email, password });
      // alert("Login successful");
      await saveLogin(res.data.token, res.data.role, res.data.profileCompleted);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.root}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.langSwitch}>
          <LanguageSwitcher />
        </View>

        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.Heading}>Diabetic Care</Text>

            <Image
              source={require("../../assets/images/bvdu-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>
              Bharati Vidyapeeth (Deemed to be University)
            </Text>

            <Text style={styles.label}>{t("auth.emailLabel")}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={t("auth.emailPlaceholder")}
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                placeholder={t("auth.passwordPlaceholder")}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ?"eye-outline":"eye-off-outline"} 
                  size={20} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={login}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>{t("auth.loginButton")}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerText}>{t("auth.goToRegister")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC", 
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  langSwitch: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  Heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  logo: {
    height: 80,
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#334155",
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  loginBtn: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 16,
    borderRadius: 12, 
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#0EA5E9",
    fontWeight: "600",
    fontSize: 14,
  },
});