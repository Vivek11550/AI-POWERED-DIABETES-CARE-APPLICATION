import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons"; // Added for better visual cues

export default function patientList() {
    const [patients, setPatients] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/patients");
            setPatients(res.data.patients);
            setCount(res.data.count);
        } catch (error: any) {
            const message =
                error?.response?.data?.message || t("adminPatientList.fetchError");
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const renderPatientCard = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.fullName?.charAt(0).toUpperCase() || "P"}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.patientName}>{item.fullName}</Text>
                    <Text style={styles.patientEmail}>{item.userId?.email || "N/A"}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.diabetesType || "N/A"}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
                <InfoItem icon="person-outline" label={t("adminPatientList.age")} value={`${item.age} yrs`} />
                <InfoItem icon="male-female-outline" label={t("adminPatientList.gender")} value={item.gender} />
                <InfoItem icon="resize-outline" label={t("adminPatientList.height")} value={`${item.heightCm} ${t("adminPatientList.cm")}`} />
                <InfoItem icon="speedometer-outline" label={t("adminPatientList.weight")} value={`${item.baselineWeightKg} ${t("adminPatientList.kg")}`} />
            </View>

            <View style={styles.footer}>
                <Ionicons name="call-outline" size={14} color="#64748B" />
                <Text style={styles.phoneText}>{item.phone}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>{t("adminPatientList.header") || "Patient Directory"}</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                        {count} {t("adminPatientList.totalPatients")}
                    </Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0EA5E9" />
                </View>
            ) : (
                <FlatList
                    data={patients}
                    keyExtractor={(item: any) => item._id}
                    renderItem={renderPatientCard}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

// Small helper component for the info grid
const InfoItem = ({ icon, label, value }: any) => (
    <View style={styles.infoItem}>
        <View style={styles.iconContainer}>
            <Ionicons name={icon} size={16} color="#0EA5E9" />
        </View>
        <View>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || "-"}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    title: {
        marginTop:30,
        fontSize: 24,
        fontWeight: "800",
        color: "#1E293B",
    },
    countBadge: {
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    countText: {
        color: "#0369A1",
        fontSize: 12,
        fontWeight: "600",
    },
    listPadding: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: "#0EA5E9",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    patientName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E293B",
    },
    patientEmail: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2,
    },
    badge: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#475569",
        textTransform: "uppercase",
    },
    divider: {
        height: 1,
        backgroundColor: "#F1F5F9",
        marginVertical: 12,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    infoItem: {
        width: "48%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#F0F9FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    infoLabel: {
        fontSize: 11,
        color: "#94A3B8",
        textTransform: "uppercase",
        fontWeight: "600",
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "600",
        color: "#334155",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#F8FAFC",
    },
    phoneText: {
        fontSize: 13,
        color: "#64748B",
        marginLeft: 6,
        fontWeight: "500",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});