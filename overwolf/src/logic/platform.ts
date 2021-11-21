export type AppHostType = 'overwolf' | 'unknown';
export type AppWindowType = 'background' | 'desktop' | 'inGame' | 'browser';

export default class AppPlatform {
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
