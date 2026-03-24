import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { useLanguage } from "@/src/context/LanguageContext";

export default function Register() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const role = "patient";

  const register = async () => {
    if (!email || !password || !confirmPassword) {
      alert(t("auth.fillAll"));
      return;
    }
    if (password !== confirmPassword) {
      alert(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      alert(t("auth.passwordLength"));
      return;
    }
    try {
      setLoading(true);
      await API.post(AUTH.REGISTER, {
        email,
        password,
        role,
      });

      alert(t("auth.registerSuccess"));
      router.replace("/(auth)/login");
    } catch (error: any) {
      const message = error?.response?.data?.message || t("auth.registerFailed");
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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.heading}>{t("auth.registerTitle")}</Text>

            {/* Professional Role Badge */}
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={18} color="#0369a1" />
              <Text style={styles.roleText}>{t("auth.roleText")}</Text>
            </View>

            {/* Email Field */}
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

            {/* Password Field */}
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
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.label}>{t("auth.confirmPasswordLabel")}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                secureTextEntry={!showPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && { opacity: 0.7 }]}
              onPress={register}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>
                  {t("auth.signUp")} 
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Redirect */}
            <TouchableOpacity 
              onPress={() => router.push("/(auth)/login")}
              style={styles.footerLink}
            >
              <Text style={styles.footerText}>
                {t("auth.alreadyAccount")}{" "}
                <Text style={styles.linkBold}>{t("auth.login")}</Text>
              </Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  roleBadge: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  roleText: {
    fontSize: 14,
    color: "#0369a1",
    fontWeight: "600",
    marginLeft: 8,
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
    marginBottom: 20,
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
  registerBtn: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#64748B",
    fontSize: 15,
  },
  linkBold: {
    color: "#0EA5E9",
    fontWeight: "700",
  },
});