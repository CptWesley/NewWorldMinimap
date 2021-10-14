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

const iconNames = {
    'npc': 'NPCs',
    'chests': 'Chests',
    'documents': 'Documents',
    'essences': 'Essences',
    'fishing': 'Fish',
    'monsters': 'Creatures',
    'ores': 'Ores',
    'plants': 'Plants',
    'pois': 'Places of Interest',
    'woods': 'Trees',

    'bear_elemental': 'Elemental Bear',
    'elk_elemental': 'Elemental Elk',
    'named': 'Boss',
    'turkey_nest': 'Turkey Nest',
    'wolf_elemental': 'Elemental Wolf',

    'monarchs_bluffs': 'Monarch\'s Bluffs',
};

function predictCorrectName(str: string) {
    const parts = str.split('_');
    const capitalizedParts = parts.map(x => x.charAt(0).toUpperCase() + x.slice(1));
    return capitalizedParts.join(' ');
}

export function getIconName(type: string) {
    return iconNames[type] ?? predictCorrectName(type);
}
