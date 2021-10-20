import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import locales from '@/locales';
import { purgeIconNames } from './logic/icons';

export type SupportedLocale = keyof typeof locales;
export const supportedLocales = Object.keys(locales) as readonly SupportedLocale[];

export const defaultLanguage: SupportedLocale = 'en';

export const storageKey = 'i18nextLng';

export const i18n = i18next;
i18n
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
        detection: {
            lookupSessionStorage: storageKey,
            lookupLocalStorage: storageKey,
        },
    });

export async function changeLanguage(language: SupportedLocale) {
    await i18next.changeLanguage(language);
    purgeIconNames();
}

window.addEventListener('storage', e => {
    if (e.key === storageKey) {
        const nextLng = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
        if (nextLng) {
            changeLanguage(nextLng as SupportedLocale);
        }
    }
});
