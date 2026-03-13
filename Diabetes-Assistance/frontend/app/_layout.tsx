import { Stack, Redirect, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";

function AuthGate() {
  const { isAuthenticated, isLoading, role, profileCompleted } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const inAuth = segments[0] === "(auth)";
  const inProfile = segments[0] === "Completeprofile";

  /** Not logged in → force login */
  if (!isAuthenticated && !inAuth) {
    return <Redirect href="/(auth)/login" />;
  }

  /** Logged in but profile not completed */
  if (isAuthenticated && profileCompleted === false && !inProfile) {
    if (role === "patient") {
      return <Redirect href="/Completeprofile/patient" />;
    }

    if (role === "doctor") {
      return <Redirect href="/Completeprofile/doctor" />;
    }
  }

  /** Logged in and profile completed → prevent going back to auth */
  if (isAuthenticated && inAuth) {
    if (role === "patient") {
      return <Redirect href="/dashboard/patient" />;
    }

    if (role === "doctor") {
      return <Redirect href="/dashboard/doctor" />;
    }
  }

  return null;
}

function AppLayout() {
  return (
    <>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppLayout />
      </LanguageProvider>
    </AuthProvider>
  );
}