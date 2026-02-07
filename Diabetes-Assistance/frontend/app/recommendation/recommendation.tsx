import { View, Text, TouchableOpacity } from "react-native";
import { i18n } from "../../src/i18n/i18n";
import {  useRouter } from "expo-router";

export default function RecommendationDashboard() {
  const router = useRouter();
  

  return (
    <View style={{ flex: 1, padding: 20, marginTop:28 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
       Recommendation Dashboard
      </Text>
       
      
      <TouchableOpacity onPress={() => router.push("/profile/patient" as any)}
        style={{
          backgroundColor: "#2563eb",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
        }}>
         <Text>go To profile</Text>
      </TouchableOpacity>


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
          Foot Care
        </Text>
        <Text style={{ color: "white", marginTop: 5 }}>
          {i18n.t("dashboard.dietSub")}
        </Text>
      </TouchableOpacity>

    </View>
  );
}
