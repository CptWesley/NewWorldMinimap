export type TileCacheWindow = typeof window & {
    NWMM_TileCache: TileCache;
}

class TileCache {
    private static _instance: TileCache;

    public static get isSupported() {
        return NWMM_APP_WINDOW === 'background';
    }

    public static get instance(): TileCache {
        if (!this.isSupported) {
            throw new Error('Using TileCache directly in this window is not supported. Use getTileCache instead.');
        }

        if (!TileCache._instance) {
            TileCache._instance = new TileCache();
        }

        return TileCache._instance;
    }
}

export function initializeTileCache() {
    if (TileCache.isSupported) {
        (window as TileCacheWindow).NWMM_TileCache = TileCache.instance;
    }
}

export function getTileCache() {
    return (overwolf.windows.getMainWindow() as TileCacheWindow).NWMM_TileCache;
}
