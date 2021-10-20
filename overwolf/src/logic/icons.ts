import { getIconNameOverride, saveTemporaryIconName } from '../Icons/MapIcons/iconNameOverrides';

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

const cache = new Map<string, string>();

export function getIconName(category: string, type?: string) {
    const key = type ? category + '::' + type : category;
    const lookup = cache.get(key);

    if (lookup) {
        return lookup;
    }

    const value = getIconNameUncached(category, type);

    cache.set(key, value);
    return value;
}

export function purgeIconNames() {
    cache.clear();
}

function getIconNameUncached(category: string, type?: string) {
    const lookup = getIconNameOverride(category, type);

    if (lookup) {
        return lookup;
    }

    const prediction = predictCorrectName(type ? type : category);
    saveTemporaryIconName(category, type, prediction);

    return prediction;
}
