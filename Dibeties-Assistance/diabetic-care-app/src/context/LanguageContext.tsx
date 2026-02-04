import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n, setLanguage } from "@/src/i18n/i18n";
import { router, usePathname } from "expo-router";

type Lang = "en" | "mr";

type LanguageContextType = {
  lang: Lang;
  t: (key: string) => string;
  changeLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem("language");
      const finalLang =
        savedLang === "en" || savedLang === "mr" ? savedLang : "en";

      await setLanguage(finalLang);
      setLang(finalLang);
    })();
  }, []);

  const changeLang = async (newLang: Lang) => {
    await setLanguage(newLang);
    setLang(newLang);
    router.replace(pathname as any);
  };

  // 🔥 THIS is the key
  const t = (key: string) => {
    return i18n.t(key);
  };

  console.log("LanguageProvider render", lang);


  return (
    <LanguageContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
