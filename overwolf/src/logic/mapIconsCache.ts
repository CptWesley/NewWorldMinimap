import { debounce } from 'lodash-es';
import { createMapIcons, MapIcons } from '../Icons/MapIcons/createMapIcons';
import UnloadingEvent from './unloadingEvent';

type OnMapIconsLoadedListener = () => void;

export default class MapIconsCache {
    private cache: MapIcons | undefined;
    private lastInitializedScale = 0;
    private onMapIconsLoadedEvent = new UnloadingEvent<OnMapIconsLoadedListener>('onMapIconsLoaded');

    public initialize = (scale: number) => {
        this.lastInitializedScale = scale;
        this.debouncedInitializeIconCache(scale);
    }

    public getIcon = (type: string, category: string): ImageBitmap | undefined => {
        if (!this.cache) {
            return undefined;
        }

        const typeImage = (this.cache as Record<string, unknown>)[type];
        if (typeImage instanceof ImageBitmap) {
            return typeImage;
        }

        const categoryImage = (this.cache as Record<string, unknown>)[category];
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

    public registerMapIconsLoaded = this.onMapIconsLoadedEvent.register;

    private initializeIconCache = async (scale: number) => {
        const nextCache = await createMapIcons(scale);
        if (scale === this.lastInitializedScale) {
            this.cache = nextCache;
            this.onMapIconsLoadedEvent.fire();
        }
    }

    private debouncedInitializeIconCache = debounce(this.initializeIconCache, 250);
}
