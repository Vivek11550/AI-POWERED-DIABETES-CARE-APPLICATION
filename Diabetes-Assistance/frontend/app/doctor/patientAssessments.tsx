import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import { useAuth } from "@/src/context/AuthContext";

export default function PatientAssessments() {
    const [patients, setPatients] = useState([]);
    const [count, setCount] = useState([]);

    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

    const { token } = useAuth();

    const fetchPatients = async () => {
        try {
            const res = await API.get("/doctor/patients-assessments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatients(res.data.patients);
            setCount(res.data.count);
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Failed to fetch patients";
            alert(message);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const getRiskColor = (level: string) => {
        if (level === "Level 3") return "#ff4d4d";
        if (level === "Level 2") return "#ffa500";
        return "#4CAF50";
    };

    return (
        <View style={{ flex: 1, padding: 15 }}>

            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
                Patient Assessments
            </Text>

            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
                Count: {count}
            </Text>

            <FlatList
                data={patients}
                keyExtractor={(item: any) => item.patient._id}
                renderItem={({ item }: any) => {

                    const isExpanded = expandedPatient === item.patient._id;

                    return (
                        <View
                            style={{
                                backgroundColor: "#fff",
                                padding: 15,
                                borderRadius: 10,
                                marginBottom: 15,
                                elevation: 2,
                            }}
                        >

                            {/* Patient Details */}
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                {item.patient.fullName}
                            </Text>

                            <Text>Age: {item.patient.age}</Text>
                            <Text>Gender: {item.patient.gender}</Text>
                            <Text>Diabetes: {item.patient.diabetesType}</Text>
                            <Text>Phone: {item.patient.phone}</Text>
                            <Text>Email: {item.patient.userId?.email}</Text>

                            {/* Button */}
                            <TouchableOpacity
                                onPress={() =>
                                    setExpandedPatient(isExpanded ? null : item.patient._id)
                                }
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "#007bff",
                                    padding: 10,
                                    borderRadius: 6,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold" }}>
                                    {isExpanded ? "Hide Assessments" : "View Assessments"}
                                </Text>
                            </TouchableOpacity>

                            {/* Assessments Section */}
                            {isExpanded && (
                                <ScrollView style={{ marginTop: 10, maxHeight: 300 }}>
                                    {item.assessments.map((assessment: any) => (
                                        <View
                                            key={assessment._id}
                                            style={{
                                                padding: 10,
                                                borderRadius: 8,
                                                marginBottom: 10,
                                                backgroundColor: "#f5f5f5",
                                                borderLeftWidth: 6,
                                                borderLeftColor: getRiskColor(assessment.riskLevel),
                                            }}
                                        >
                                            <Text style={{ fontWeight: "bold" }}>
                                                Risk Level: {assessment.riskLevel}
                                            </Text>

                                            <Text>Weight: {assessment.weightKg} kg</Text>
                                            <Text>BMI: {assessment.bmi}</Text>
                                            <Text>HbA1c: {assessment.hba1c}</Text>
                                            <Text>Fasting Sugar: {assessment.fastingSugar}</Text>
                                            <Text>Post Meal Sugar: {assessment.postPrandialSugar}</Text>

                                            <Text style={{ marginTop: 5, fontSize: 12 }}>
                                                {new Date(assessment.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
}