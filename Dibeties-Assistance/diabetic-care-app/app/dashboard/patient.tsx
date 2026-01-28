import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

export default function PatientDashboard() {
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    loadPatientChat();
  }, []);

  const loadPatientChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/chat/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChatId(res.data._id);
    } catch {
      // No chat yet → do nothing
      setChatId(null);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Patient Dashboard
      </Text>

      {/* Health Assessment Card */}
      <TouchableOpacity
        onPress={() => router.push("/assessment" as any)}
        style={{
          backgroundColor: "#2563eb",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Health Assessment
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          Enter sugar levels & analyze risk
        </Text>
      </TouchableOpacity>

      {/* Diet Recommendation Card */}
      <TouchableOpacity
        style={{
          backgroundColor: "#16a34a",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Diet Plan
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          View personalized diet suggestions
        </Text>
      </TouchableOpacity>

      {/* Exercise Recommendation Card */}
      <TouchableOpacity
        style={{
          backgroundColor: "#f59e0b",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Exercise Plan
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          View exercises with animations
        </Text>
      </TouchableOpacity>

      {/* CHAT WITH DOCTOR (ONLY IF EXISTS) */}
      {chatId && (
        <TouchableOpacity
          onPress={() =>
            router.push(`/chat?chatId=${chatId}` as any)
          }
          style={{
            backgroundColor: "#0ea5e9",
            padding: 20,
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>
            💬 Chat with Doctor
          </Text>
          <Text style={{ color: "white", marginTop: 5 }}>
            View doctor’s advice & reply
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
