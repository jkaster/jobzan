import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslation from "./locales/en/translation.json";

/**
 * Initializes the i18n (internationalization) library for the application.
 * Configures language resources, default language, and interpolation settings.
 */
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
    },
    lng: "en", // default language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;
