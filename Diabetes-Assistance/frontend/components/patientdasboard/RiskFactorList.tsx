import { View, Text } from "react-native";
import RiskFactorCard from "./RiskFactorCard";

export interface AssessmentData {
  bmi: number;
  fastingSugar: number;
  postPrandialSugar: number;
  hba1c: number;
  footUlcer: boolean;
  neuropathy: boolean;
  riskLevel: string;
}

export default function RiskFactorList({
  assessment,
}: {
  assessment: AssessmentData;
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        Factors Influencing Your Risk
      </Text>

      <RiskFactorCard
        title="BMI"
        value={`BMI ${assessment.bmi}`}
      />

      <RiskFactorCard
        title="Fasting Sugar"
        value={`${assessment.fastingSugar} mg/dL`}
      />

      <RiskFactorCard
        title="Postprandial Sugar"
        value={`${assessment.postPrandialSugar} mg/dL`}
      />

      <RiskFactorCard
        title="HbA1c"
        value={`${assessment.hba1c}%`}
      />

      <RiskFactorCard
        title="Foot Ulcer"
        value={assessment.footUlcer ? "Present" : "Absent"}
      />

      <RiskFactorCard
        title="Neuropathy"
        value={assessment.neuropathy ? "Present" : "Absent"}
      />
    </View>
  );
}
