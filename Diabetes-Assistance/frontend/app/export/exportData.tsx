import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExportData() {

    const downloadCSV = async (endpoint: string, fileName: string) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const url = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`;

            const fileUri = FileSystem.documentDirectory + fileName;

            const result = await FileSystem.downloadAsync(url, fileUri, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(result.uri);
            } else {
                Alert.alert("File saved", result.uri);
            }

        } catch (error) {
            console.log("Export error:", error);
            Alert.alert("Export failed");
        }
    };

    return (
        <View style={{ padding: 20 }}>

            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Export Data
            </Text>

            <TouchableOpacity
                onPress={() => downloadCSV("/export/patients", "patients.csv")}
                style={{
                    backgroundColor: "#2563eb",
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 15,
                }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    Export Patient Details
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    downloadCSV("/export/assessments", "patient_assessments.csv")
                }
                style={{
                    backgroundColor: "#16a34a",
                    padding: 15,
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    Export Patient Assessments
                </Text>
            </TouchableOpacity>

        </View>
    );
}