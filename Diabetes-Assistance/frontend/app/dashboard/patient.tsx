import { View, Text, TouchableOpacity, Button } from "react-native";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { i18n } from "../../src/i18n/i18n";
import {  useRouter } from "expo-router";
import { setLanguage } from "@/src/i18n/i18n";

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
    <View style={{ flex: 1, padding: 20, marginTop:28 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
       {i18n.t("patientDashboard")}
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
          {i18n.t("dashboard.assessmentTitle")}
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          {i18n.t("dashboard.assessmentSub")}
        </Text>
      </TouchableOpacity>
     
      {/* Diet Recommendation Card */}
      <TouchableOpacity
      onPress={() => router.push("/diet" as any)}
        style={{
          backgroundColor: "#16a34a",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {i18n.t("dashboard.dietTitle")}
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          {i18n.t("dashboard.dietSub")}
        </Text>
      </TouchableOpacity>

      {/* Exercise Recommendation Card */}
      <TouchableOpacity
      onPress={() => router.push("/exercise" as any)}
        style={{
          backgroundColor: "#f59e0b",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {i18n.t("dashboard.exerciseTitle")}
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
         {i18n.t("dashboard.exerciseSub")}
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
            💬 {i18n.t("dashboard.chatTitle")}
          </Text>
          <Text style={{ color: "white", marginTop: 5 }}>
            {i18n.t("dashboard.chatSub")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
