import { createMapIconCache } from '../Icons/MapIcons/mapIconCache';

let iconCachePromise = createMapIconCache(2.5);
let currentScale = 2.5;

export async function setIconScale(newScale: number) {
    if (currentScale === newScale) {
        return;
    }

    currentScale = newScale;
    iconCachePromise = createMapIconCache(newScale);
}

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

    const unknownImage = iconCache.unknown;
    return unknownImage;
}

export async function GetPlayerIcon() {
    const iconCache = await iconCachePromise;
    return iconCache.player;
}
