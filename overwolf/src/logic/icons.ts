import { createMapIconCache } from '../Icons/MapIcons/mapIconCache';

const iconCachePromise = createMapIconCache(2.5);

export async function getIcon(type: string, category: string) {
    const iconCache = await iconCachePromise;
    const typeImage = iconCache[type] as ImageBitmap;

    if (typeImage) {
        return typeImage;
    }

    const catImage = iconCache[category] as ImageBitmap;

    if (catImage) {
        return catImage;
    }

    const unknownImage = iconCache['unknown'];
    return unknownImage;
}

export async function GetPlayerIcon() {
    const iconCache = await iconCachePromise;
    return iconCache.player;
}
