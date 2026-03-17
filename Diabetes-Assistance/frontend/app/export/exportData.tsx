import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";

export default function ExportData() {
    const router = useRouter();
    const [exporting, setExporting] = useState<string | null>(null);

    const downloadCSV = async (endpoint: string, fileName: string) => {
        try {
            setExporting(fileName);
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
            Alert.alert("Export failed", "Could not generate report at this time.");
        } finally {
            setExporting(null);
        }
    };

    return (
        // Changed: Removed 'top' edge so the Stack Header sits correctly at the top
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen 
                options={{ 
                    headerShown: true, // Explicitly force header visibility
                    title: "Data Reports", 
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#F8FAFC' },
                    headerTitleStyle: { fontWeight: '800', color: '#0F172A' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={28} color="#0F172A" />
                        </TouchableOpacity>
                    )
                }} 
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="cloud-download-outline" size={32} color="#0EA5E9" />
                    </View>
                    <Text style={styles.infoTitle}>Clinical Data Export</Text>
                    <Text style={styles.infoSub}>
                        Generate and download CSV reports for offline analysis or record keeping.
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Available Reports</Text>

                {/* Export Button 1 */}
                <TouchableOpacity
                    onPress={() => downloadCSV("/export/patients", "patients.csv")}
                    style={[styles.exportCard, exporting === "patients.csv" && styles.disabledCard]}
                    disabled={exporting !== null}
                >
                    <View style={[styles.cardIcon, { backgroundColor: '#E0F2FE' }]}>
                        <Ionicons name="people" size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Patient Registry</Text>
                        <Text style={styles.cardSub}>Complete list of all registered patients</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>

                {/* Export Button 2 */}
                <TouchableOpacity
                    onPress={() => downloadCSV("/export/assessments", "patient_assessments.csv")}
                    style={[styles.exportCard, exporting === "patient_assessments.csv" && styles.disabledCard]}
                    disabled={exporting !== null}
                >
                    <View style={[styles.cardIcon, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="analytics" size={24} color="#16A34A" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Assessment Logs</Text>
                        <Text style={styles.cardSub}>Detailed history of all health assessments</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>

                <View style={styles.footerNote}>
                    <Ionicons name="shield-checkmark" size={14} color="#94A3B8" />
                    <Text style={styles.footerText}>
                        Exports are generated in CSV format and comply with data privacy standards.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    backBtn: { marginLeft: 0, padding: 5 }, // Aligned for standard header placement
    scrollContent: { padding: 24 },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9'
    },
    iconCircle: {
        width: 70, height: 70, borderRadius: 35,
        backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    infoTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
    infoSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },
    
    sectionLabel: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    
    exportCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.03,
    },
    disabledCard: { opacity: 0.6 },
    cardIcon: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    cardText: { flex: 1, marginLeft: 16 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
    cardSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
    
    footerNote: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 10, gap: 8 },
    footerText: { fontSize: 11, color: '#94A3B8', flex: 1, lineHeight: 16 }
});