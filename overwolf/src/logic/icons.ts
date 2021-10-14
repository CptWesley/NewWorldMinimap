import { iconNameOverrides } from '../Icons/MapIcons/iconNameOverrides';
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

function getChestCategoryName(str: string) {
    switch (str.charAt(0)) {
        case 's': return 'Supply';
        case 'c': return 'Provisions';
        case 'o': return 'Ancient';
        case 'a': return 'Alchemy';
        default: return undefined;
    }
}

function getChestTypeName(str: string) {
    switch (str.charAt(1)) {
        case 'e': return 'Elite Stockpile';
        case 'l': return 'Stockpile';
        case 's': return 'Cache';
        case 'm': return 'Crate';
        default: return undefined;
    }
}

function predictCorrectName(str: string) {
    const matches = str.match(/^\w\w\d$/);

    if (matches && matches.length === 1) {
        const match = matches[0];
        const cat = getChestCategoryName(match);
        const type = getChestTypeName(match);

        if (cat && type) {
            return cat + ' ' + type + ' T' + match.charAt(2);
        }
    }

    const parts = str.split('_');
    const capitalizedParts = parts.map(x => x.charAt(0).toUpperCase() + x.slice(1));
    return capitalizedParts.join(' ');
}

export function getIconName(type: string) {
    return iconNameOverrides[type] ?? predictCorrectName(type);
}
