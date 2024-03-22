import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Platform } from "react-native";
import ar from "./ar.json"; //arabic
import fr from "./fr.json"; //french
import es from "./es.json"; //Spanish
import en from "./en.json"; // English
import it from "./it.json"; //italic
import de from "./de.json"; //German

const locale =
  Platform.OS === "ios"
    ? // ? NativeModules.SettingsManager.settings.AppleLocale
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const languageDetector = {
  init: Function.prototype,
  type: "languageDetector",
  async: true, // flags below detection to be async
  detect: async (callback) => {
    const selectedLanguage = await AsyncStorage.getItem("language");

    /** ... */
    selectedLanguage == null
      ? callback(locale.substring(0, 2))
      : callback(selectedLanguage);
  },
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3",
    resources: { ar, fr, es, it, de },
    fallbackLng: "en",
    // lng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
