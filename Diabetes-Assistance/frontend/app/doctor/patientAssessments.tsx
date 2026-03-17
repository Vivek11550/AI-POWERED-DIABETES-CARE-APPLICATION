import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useEffect, useState, useCallback } from "react";
// Using useSafeAreaInsets for manual notch control
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import API from "../../src/services/api";
import { useAuth } from "@/src/context/AuthContext";

export default function PatientAssessments() {
    const insets = useSafeAreaInsets();
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

    const { token } = useAuth();
    const router = useRouter();

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/doctor/patients-assessments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(res.data.patients);
            setFilteredPatients(res.data.patients);
        } catch (error: any) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = patients.filter((item: any) => 
            item.patient.fullName.toLowerCase().includes(text.toLowerCase()) ||
            item.patient.userId?.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPatients(filtered);
    };

    const getRiskColor = (level: string) => {
        if (level === "Level 3") return "#EF4444";
        if (level === "Level 2") return "#F59E0B";
        return "#10B981";
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0EA5E9" />
                <Text style={styles.loadingText}>Syncing medical records...</Text>
            </View>
        );
    }

    return (
        // We use edges={['bottom', 'left', 'right']} because the top is handled by the Stack Header
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right',]}>
            <Stack.Screen 
                options={{ 
                    headerShown: true, // Ensure header is visible
                    title: "Medical Archives", 
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FFFFFF' },
                    headerTitleStyle: { fontWeight: '800', color: '#0F172A' },
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.back()} 
                            style={styles.headerBackBtn}
                        >
                            <Ionicons name="chevron-back" size={28} color="#0F172A" />
                        </TouchableOpacity>
                    )
                }} 
            />

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                {/* --- SEARCH HEADER --- */}
                <View style={styles.searchHeader}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={20} color="#94A3B8" />
                        <TextInput 
                            placeholder="Find patient by name..."
                            style={styles.input}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholderTextColor="#94A3B8"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => handleSearch("")}>
                                <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item: any) => item.patient._id}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="documents-outline" size={60} color="#E2E8F0" />
                            <Text style={styles.emptyText}>No matching patient records found.</Text>
                        </View>
                    }
                    renderItem={({ item }: any) => {
                        const isExpanded = expandedPatient === item.patient._id;
                        return (
                            <View style={[styles.card, isExpanded && styles.expandedCard]}>
                                <TouchableOpacity 
                                    activeOpacity={0.7}
                                    onPress={() => setExpandedPatient(isExpanded ? null : item.patient._id)}
                                    style={styles.cardMain}
                                >
                                    <View style={styles.patientBadge}>
                                        <Text style={styles.avatarText}>{item.patient.fullName[0]}</Text>
                                    </View>
                                    <View style={styles.infoCol}>
                                        <Text style={styles.nameText}>{item.patient.fullName}</Text>
                                        <Text style={styles.subText}>{item.patient.phone || 'No Phone'}</Text>
                                    </View>
                                    <View style={styles.rightInfo}>
                                        <Text style={styles.countTag}>{item.assessments.length} Entry</Text>
                                        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#CBD5E1" />
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.detailsArea}>
                                        <View style={styles.metaGrid}>
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>TYPE</Text>
                                                <Text style={styles.metaVal}>{item.patient.diabetesType}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>GENDER</Text>
                                                <Text style={styles.metaVal}>{item.patient.gender}</Text>
                                            </View>
                                        </View>

                                        <Text style={styles.timelineTitle}>Recent History</Text>
                                        {item.assessments.map((asm: any) => (
                                            <View key={asm._id} style={[styles.asmRow, { borderLeftColor: getRiskColor(asm.riskLevel) }]}>
                                                <View style={styles.asmHeader}>
                                                    <Text style={[styles.riskTag, { color: getRiskColor(asm.riskLevel) }]}>{asm.riskLevel}</Text>
                                                    <Text style={styles.dateText}>{new Date(asm.createdAt).toLocaleDateString()}</Text>
                                                </View>
                                                <View style={styles.metricsStrip}>
                                                    <Text style={styles.metricItem}>HbA1c: <Text style={styles.boldMetric}>{asm.hba1c || '--'}</Text></Text>
                                                    <Text style={styles.metricItem}>Sugar: <Text style={styles.boldMetric}>{asm.fastingSugar || '--'}</Text></Text>
                                                    <Text style={styles.metricItem}>BMI: <Text style={styles.boldMetric}>{asm.bmi || '--'}</Text></Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, color: "#64748B", fontSize: 13, fontWeight: '500' },
    
    // Header Back Button Style
    headerBackBtn: {
        marginLeft: 10,
        marginTop:10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    searchHeader: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 14,
        paddingHorizontal: 15,
        height: 50,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1E293B' },
    
    listPadding: { padding: 20, paddingBottom: 40 },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    expandedCard: { borderColor: '#E2E8F0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    cardMain: { padding: 16, flexDirection: 'row', alignItems: 'center' },
    patientBadge: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#0EA5E9', justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: 'white', fontWeight: '800', fontSize: 18 },
    infoCol: { flex: 1, marginLeft: 15 },
    nameText: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    subText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    rightInfo: { alignItems: 'flex-end' },
    countTag: { fontSize: 10, fontWeight: '800', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 5 },
    
    detailsArea: { padding: 16, paddingTop: 0, backgroundColor: '#FCFDFF' },
    metaGrid: { flexDirection: 'row', gap: 20, marginBottom: 15, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 },
    metaItem: { flex: 1 },
    metaLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
    metaVal: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 2 },
    
    timelineTitle: { fontSize: 12, fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: 12 },
    asmRow: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9'
    },
    asmHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    riskTag: { fontSize: 12, fontWeight: '900' },
    dateText: { fontSize: 11, color: '#94A3B8' },
    metricsStrip: { flexDirection: 'row', justifyContent: 'space-between' },
    metricItem: { fontSize: 11, color: '#64748B' },
    boldMetric: { color: '#1E293B', fontWeight: '700' },

    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#94A3B8', marginTop: 12, fontSize: 14 }
});