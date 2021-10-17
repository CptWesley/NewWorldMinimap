import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import locales from '@/locales';

export type SupportedLanguage = keyof typeof locales;
export const supportedLanguages = Object.keys(locales) as readonly SupportedLanguage[];

const defaultLanguage: SupportedLanguage = 'en';

i18next
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: defaultLanguage,
        debug: !NWMM_APP_BUILD_PRODUCTION,
        resources: locales,
        defaultNS: 'common',
        interpolation: {
            // React already escapes everything
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
    });

export async function changeLanguage(language: SupportedLanguage) {
    await i18next.changeLanguage(language);
}
