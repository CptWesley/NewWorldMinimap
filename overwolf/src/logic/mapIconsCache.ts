import { debounce } from 'lodash-es';
import { createMapIcons, MapIcons } from '../Icons/MapIcons/createMapIcons';

type OnMapIconsLoadedListener = () => void;

export default class MapIconsCache {
    private cache: MapIcons | undefined;
    private lastInitializedScale = 0;
    private onMapIconsLoadedListeners = new Set<OnMapIconsLoadedListener>();

    public initialize = (scale: number) => {
        this.lastInitializedScale = scale;
        this.debouncedInitializeIconCache(scale);
    }

    public getIcon = (type: string, category: string): ImageBitmap | undefined => {
        if (!this.cache) {
            return undefined;
        }

        const typeImage = this.cache[type] as unknown;
        if (typeImage instanceof ImageBitmap) {
            return typeImage;
        }

        const categoryImage = this.cache[category] as unknown;
        if (categoryImage instanceof ImageBitmap) {
            return categoryImage;
        }

        const unknownImage = this.cache.unknown;
        return unknownImage;
    }

    public getPlayerIcon = (): ImageBitmap | undefined => {
        if (!this.cache) {
            return undefined;
        }

        return this.cache.player;
    }

    public getFriendIcon = (): ImageBitmap | undefined => {
        if (!this.cache) {
            return undefined;
        }

        return this.cache.friend;
    }

    public registerMapIconsLoaded = (listener: OnMapIconsLoadedListener) => {
        this.onMapIconsLoadedListeners.add(listener);
        return () => {
            this.onMapIconsLoadedListeners.delete(listener);
        };
    }

    private initializeIconCache = async (scale: number) => {
        const nextCache = await createMapIcons(scale);
        if (scale === this.lastInitializedScale) {
            this.cache = nextCache;
            this.onMapIconsLoadedListeners.forEach(l => {
                l();
            });
        }
    }

    private debouncedInitializeIconCache = debounce(this.initializeIconCache, 250);
}
