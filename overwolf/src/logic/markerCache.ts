export type MarkerCacheWindow = typeof window & {
    NWMM_MarkerCache: MarkerCache;
}

class MarkerCache {
    private static _instance: MarkerCache;

    public static get isSupported() {
        return NWMM_APP_WINDOW === 'background';
    }

    public static get instance(): MarkerCache {
        if (!this.isSupported) {
            throw new Error('Using MarkerCache directly in this window is not supported. Use getMarkerCache instead.');
        }

        if (!MarkerCache._instance) {
            MarkerCache._instance = new MarkerCache();
        }

        return MarkerCache._instance;
    }
}

export function initializeMarkerCache() {
    if (MarkerCache.isSupported) {
        (window as MarkerCacheWindow).NWMM_MarkerCache = MarkerCache.instance;
    }
}

export function getMarkerCache() {
    return (overwolf.windows.getMainWindow() as MarkerCacheWindow).NWMM_MarkerCache;
}
