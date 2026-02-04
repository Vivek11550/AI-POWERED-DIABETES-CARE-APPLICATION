import { I18n } from "i18n-js";
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

i18n.locale = "en";

/* ---------------- HELPERS ---------------- */

export const setLanguage = async (lang: "en" | "mr") => {
  i18n.locale = lang;
  await AsyncStorage.setItem("language", lang);
};


