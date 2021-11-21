import { initializeDynamicSettings } from './dynamicSettings';
import { initializeHooks } from './hooks';
import { initializeHotkeyManager } from './hotkeyManager';
import { Informant } from './informant';
import { initializeNavigation } from './navigation/navigation';
import { initializeTileCache } from './tileCache';
import { initializeTileMarkerCache } from './tileMarkerCache';

export type AppHostType = 'overwolf' | 'unknown';
export type AppWindowType = 'background' | 'desktop' | 'inGame' | 'browser';

export type AppPlatformStateWindow = typeof window & {
    NWMM_platformState: AppPlatformState;
}

function initializeAppPlatformState() {
    return {
        getDynamicSettings: initializeDynamicSettings(),
        informant: new Informant(),
        registerDataUpdate: initializeHooks(),
        tileCache: initializeTileCache(),
        tileMarkerCache: initializeTileMarkerCache(),
        hotkeyManager: initializeHotkeyManager(),
        navigation: initializeNavigation(),
    };
}
type AppPlatformState = ReturnType<typeof initializeAppPlatformState>;

export default class AppPlatform {
    private static appPlatformState: AppPlatformState | undefined;

    public static get state(): AppPlatformState {
        if (!this.appPlatformState) {
            if (!this.isOverwolfApp() || this.getAppWindowType() === 'background') {
                (window as AppPlatformStateWindow).NWMM_platformState = initializeAppPlatformState();
            }
            this.appPlatformState = (this.getMainWindow() as AppPlatformStateWindow).NWMM_platformState;
        }
        return this.appPlatformState;
    }

    public static getAppHostType = (): AppHostType => {
        if (location.protocol.toLowerCase().startsWith('overwolf')) {
            return 'overwolf';
        }
        return 'unknown';
    }

    public static isOverwolfApp = () => this.getAppHostType() === 'overwolf';

    public static getAppWindowType = (): AppWindowType => {
        if (this.isOverwolfApp()) {
            if (NWMM_APP_WINDOW) {
                return NWMM_APP_WINDOW;
            }
        }
        return 'browser';
    }

    public static getMainWindow = (): Window => {
        if (this.isOverwolfApp()) {
            // We're an Overwolf app, so return that window.
            return overwolf.windows.getMainWindow();
        }
        // Return the browser window object instead.
        return window;
    }
}
