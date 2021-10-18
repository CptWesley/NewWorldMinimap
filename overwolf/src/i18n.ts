import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import locales from '@/locales';

export type SupportedLocale = keyof typeof locales;
export const supportedLocales = Object.keys(locales) as readonly SupportedLocale[];

const defaultLanguage: SupportedLocale = 'en';

export const i18n = i18next;
i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: defaultLanguage,
        debug: !NWMM_APP_BUILD_PRODUCTION,
        resources: locales,
        ns: Object.keys(locales[defaultLanguage]),
        defaultNS: 'common',
        interpolation: {
            // React already escapes everything
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
    });

export async function changeLanguage(language: SupportedLocale) {
    await i18next.changeLanguage(language);
}
