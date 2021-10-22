import UnloadingEvent from './unloadingEvent';

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
    status: 'requested' | 'downloading' | 'failed',
};

type TileCacheResult = TileCacheHit | TileCacheMiss;

type OnTileDownloadingCountChangeListener = (count: number) => void;

class TileCache {
    private static _instance: TileCache;
    private tileBitmapCache = new Map<string, ImageBitmap>();
    private downloadingBitmapCache = new Map<string, Promise<ImageBitmap>>();
    private failedBitmapCache = new Set<string>();
    private onTileDownloadingCountChangeEvent = new UnloadingEvent<OnTileDownloadingCountChangeListener>('tileCacheDownloadingCountChange');

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
            if (this.failedBitmapCache.has(key)) {
                return { hit: false, status: 'failed' };
            } else if (this.downloadingBitmapCache.has(key)) {
                return { hit: false, status: 'downloading' };
            } else {
                const tileBitmapPromise = this.getTileBitmapFromServer(position);
                this.downloadingBitmapCache.set(key, tileBitmapPromise);
                tileBitmapPromise.then(bitmap => {
                    this.tileBitmapCache.set(key, bitmap);
                    this.downloadingBitmapCache.delete(key);
                    this.onTileDownloadingCountChangeEvent.fire(this.downloadingBitmapCache.size);
                });
                tileBitmapPromise.catch(() => {
                    this.failedBitmapCache.add(key);
                    this.downloadingBitmapCache.delete(key);
                    this.onTileDownloadingCountChangeEvent.fire(this.downloadingBitmapCache.size);
                });
                this.onTileDownloadingCountChangeEvent.fire(this.downloadingBitmapCache.size);
                return { hit: false, status: 'requested' };
            }
        }
    }

    public registerOnTileDownloadingCountChange = this.onTileDownloadingCountChangeEvent.register;

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
