import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();
  console.log("Switcher lang:", lang);
  console.log("Switcher rendered");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, lang === "en" && styles.active]}
        onPress={() => changeLang("en")}
      >
        <Text style={[styles.text, lang === "en" && styles.activeText]}>
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, lang === "mr" && styles.active]}
        onPress={() => changeLang("mr")}
      >
        <Text style={[styles.text, lang === "mr" && styles.activeText]}>
          MR
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E8F2EC",
    borderRadius: 20,
    padding: 2,
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  active: {
    backgroundColor: "#9CC9A7",
  },

  text: {
    fontWeight: "600",
    color: "#2E4E3F",
  },

  activeText: {
    color: "#1F3D2B",
  },
});
