export function getTileCacheKey(tilePos: Vector2) {
    return `${tilePos.x},${tilePos.y}`;
}

export type TileCacheWindow = typeof window & {
    NWMM_TileCache: TileCache;
}

type TileCacheHit = {
    hit: true,
    bitmap: ImageBitmap,
};

type TileCacheMiss = {
    hit: false,
    downloading: boolean,
};

type TileCacheResult = TileCacheHit | TileCacheMiss;

type OnTileDownloadingCountChangeListener = (count: number) => void;

class TileCache {
    private static _instance: TileCache;
    private tileBitmapCache = new Map<string, ImageBitmap>();
    private downloadingBitmapCache = new Map<string, Promise<ImageBitmap>>();
    private onTileDownloadingCountChangeListeners = new Set<OnTileDownloadingCountChangeListener>();

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

    public get tilesDownloadingCount(): number {
        return this.downloadingBitmapCache.size;
    }

    public getTileBitmap = (position: Vector2): TileCacheResult => {
        const key = getTileCacheKey(position);

        const hit = this.tileBitmapCache.get(key);
        if (hit) {
            return { hit: true, bitmap: hit };
        } else {
            if (this.downloadingBitmapCache.has(key)) {
                return { hit: false, downloading: true };
            } else {
                const tileBitmapPromise = this.getTileBitmapFromServer(position);
                this.downloadingBitmapCache.set(key, tileBitmapPromise);
                tileBitmapPromise.then(bitmap => {
                    this.tileBitmapCache.set(key, bitmap);
                    this.downloadingBitmapCache.delete(key);
                    this.onTileDownloadingCountChangeListeners.forEach(l => {
                        l(this.downloadingBitmapCache.size);
                    });
                });
                this.onTileDownloadingCountChangeListeners.forEach(l => {
                    l(this.downloadingBitmapCache.size);
                });
                return { hit: false, downloading: false };
            }
        }
    }

    public registerOnTileDownloadingCountChange = (listener: OnTileDownloadingCountChangeListener) => {
        this.onTileDownloadingCountChangeListeners.add(listener);
        return () => {
            this.onTileDownloadingCountChangeListeners.delete(listener);
        };
    }

    public clear = () => {
        this.downloadingBitmapCache.clear();
        this.tileBitmapCache.clear();
    }

    private getTileBitmapFromServer = async (position: Vector2) => {
        const imageUrl = TileCache.getTileImageUrl(position);
        const imageRequest = await fetch(imageUrl, {
            method: 'get',
        });
        const imageBlob = await imageRequest.blob();
        const bitmap = await createImageBitmap(imageBlob);
        return bitmap;
    }

    private static getTileImageUrl(tilePos: Vector2) {
        return `https://cdn.newworldfans.com/newworldmap/8/${tilePos.x}/${tilePos.y}.png`;
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
