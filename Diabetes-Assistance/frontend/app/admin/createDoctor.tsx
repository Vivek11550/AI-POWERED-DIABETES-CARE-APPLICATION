import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import { useAuth } from "@/src/context/AuthContext";

export default function CreateDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();
  const role = "doctor";

  const register = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await API.post(AUTH.REGISTER, {
        email,
        password,
        role,
      });

      alert("Doctor account created successfully");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ================= HEADER CONFIG ================= */}
      <Stack.Screen 
        options={{
          title: "Admin Dashboard",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutHeaderBtn}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          )
        }} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN PANEL</Text>
            </View>
            <Text style={styles.title}>Register New Doctor</Text>
            <Text style={styles.subtitle}>Create official credentials for nursing college experts</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#0369a1" />
              <Text style={styles.infoText}>This account will be assigned the 'Doctor' role by default.</Text>
            </View>

            {/* Email Field */}
            <Text style={styles.label}>Doctor's Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="doctor@nursingcollege.edu"
              placeholderTextColor="#94A3B8"
            />

            {/* Password Field */}
            <Text style={styles.label}>SET Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                placeholder="Set initial password"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerBtn, loading && { opacity: 0.7 }]}
              onPress={register}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.registerBtnText}>Create Doctor Account</Text>
                  <Ionicons name="person-add-outline" size={20} color="white" style={{marginLeft: 8}} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            The doctor can complete their profile (Name, Specialization, etc.) once they log in for the first time.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  backBtn: { marginLeft: 10, padding: 5 },
  logoutHeaderBtn: { marginRight: 15, padding: 5 },
  scrollContent: { padding: 24, justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  adminBadge: { 
    backgroundColor: '#0F172A', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginBottom: 10 
  },
  adminBadgeText: { color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", textAlign: 'center', marginTop: 5 },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F9FF', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  infoText: { fontSize: 12, color: '#0369a1', marginLeft: 8, flex: 1, fontWeight: '500' },
  label: { fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 20,
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
    marginBottom: 25,
  },
  passwordInput: { flex: 1, padding: 16, fontSize: 16, color: "#1E293B" },
  eyeIcon: { paddingHorizontal: 16 },
  registerBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  registerBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  footerNote: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 25, paddingHorizontal: 20, lineHeight: 18 }
});