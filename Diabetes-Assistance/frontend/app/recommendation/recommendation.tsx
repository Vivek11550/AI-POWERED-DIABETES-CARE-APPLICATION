import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Dimensions 
} from "react-native";
import { i18n } from "../../src/i18n/i18n";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 15) / 2;

export default function RecommendationDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: i18n.t("recommend.header"),
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/profile/patient" as any)}>
               <Ionicons name="person-circle-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
          )
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.topHeader}>
          <Text style={styles.title}>{i18n.t("recommend.title")}</Text>
          <Text style={styles.subtitle}>{i18n.t("recommend.subtitle")}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/assessment" as any)}
          style={styles.mainCard}
        >
          <View style={styles.mainCardIconBox}>
            <Ionicons name="analytics" size={28} color="#fff" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.mainCardTitle}>{i18n.t("dashboard.assessmentTitle")}</Text>
            <Text style={styles.mainCardSubtext}>{i18n.t("dashboard.assessmentSub")}</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>{i18n.t("recommend.section")}</Text>

        <View style={styles.gridContainer}>
          
          <TouchableOpacity
            onPress={() => router.push("/diet" as any)}
            style={[styles.gridCard, { borderTopColor: "#10B981" }]}
          >
            <View style={[styles.miniIconBg, { backgroundColor: '#ECFDF5' }]}>
               <Ionicons name="restaurant" size={22} color="#10B981" />
            </View>
            <Text style={styles.gridTitle}>{i18n.t("dashboard.dietTitle")}</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              {i18n.t("dashboard.dietSub")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/exercise" as any)}
            style={[styles.gridCard, { borderTopColor: "#F59E0B" }]}
          >
            <View style={[styles.miniIconBg, { backgroundColor: '#FFFBEB' }]}>
               <Ionicons name="fitness" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.gridTitle}>{i18n.t("dashboard.exerciseTitle")}</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              {i18n.t("dashboard.exerciseSub")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/footcare" as any)}
            style={[styles.gridCard, { borderTopColor: "#0EA5E9" }]}
          >
            <View style={[styles.miniIconBg, { backgroundColor: '#F0F9FF' }]}>
               <Ionicons name="body" size={22} color="#0EA5E9" />
            </View>
            <Text style={styles.gridTitle}>{i18n.t("recommend.foot")}</Text>
            <Text style={styles.gridSubtext} numberOfLines={2}>
              {i18n.t("recommend.footSub")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/quiz/dashboard" as any)}
            style={[styles.gridCard, { borderTopColor: "#8B5CF6" }]}
          >
            <View style={[styles.miniIconBg, { backgroundColor: '#F5F3FF' }]}>
               <Ionicons name="extension-puzzle" size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.gridTitle}>{i18n.t("recommend.knowledge")}</Text>
            <Text style={styles.gridSubtext}>
              {i18n.t("recommend.knowledgeSub")}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  backBtn: { marginLeft: 10, padding: 5 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  mainCard: {
    backgroundColor: "#0EA5E9",
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  mainCardIconBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 16,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  mainCardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  mainCardSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500'
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  gridCard: {
    backgroundColor: "white",
    width: CARD_WIDTH, 
    padding: 18,
    borderRadius: 20,
    borderTopWidth: 4, // Changed from left to top for a more modern header look
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  miniIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  gridSubtext: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '500'
  },
});