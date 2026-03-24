import { View, Text } from "react-native";
import RiskFactorCard from "./RiskFactorCard";
import { useLanguage } from "@/src/context/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        {t("riskFactors.title")}
      </Text>

      <RiskFactorCard
        title={t("riskFactors.bmi")}
        value={`BMI ${assessment.bmi}`}
      />

      <RiskFactorCard
        title={t("riskFactors.fasting")}
        value={`${assessment.fastingSugar} mg/dL`}
      />

      <RiskFactorCard
        title={t("riskFactors.postprandial")}
        value={`${assessment.postPrandialSugar} mg/dL`}
      />

      <RiskFactorCard
        title={t("riskFactors.hba1c")}
        value={`${assessment.hba1c}%`}
      />

      <RiskFactorCard
        title={t("riskFactors.footUlcer")}
        value={
          assessment.footUlcer
            ? t("common.present")
            : t("common.absent")
        }
      />

      <RiskFactorCard
        title={t("riskFactors.neuropathy")}
        value={
          assessment.neuropathy
            ? t("common.present")
            : t("common.absent")
        }
      />
    </View>
  );
}