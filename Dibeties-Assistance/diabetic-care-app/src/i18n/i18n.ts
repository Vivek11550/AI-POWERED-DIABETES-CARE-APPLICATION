import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en";
import mr from "./mr";

/* ---------------- CREATE I18N INSTANCE ---------------- */

export const i18n = new I18n({
  en,
  mr,
});

i18n.enableFallback = true;

/* ---------------- SET DEFAULT LOCALE (FIXED) ---------------- */

// Expo-safe way to get device language
const deviceLanguage =
  Localization.getLocales()[0]?.languageCode ?? "en";

i18n.locale = deviceLanguage === "mr" ? "mr" : "en";

/* ---------------- HELPERS ---------------- */

export const setLanguage = async (lang: "en" | "mr") => {
  i18n.locale = lang;
  await AsyncStorage.setItem("language", lang);
};

export const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem("language");
  if (savedLang) {
    i18n.locale = savedLang;
  }
};
