import { iconNameOverrides } from '../Icons/MapIcons/iconNameOverrides';

export async function GetFriendIcon() {
    const iconCache = await iconCachePromise;
    return iconCache.friend;
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
    const lookup = iconNameOverrides[type];

    if (lookup) {
        return lookup;
    }

    const prediction = predictCorrectName(type);
    iconNameOverrides[type] = prediction;

    return prediction;
}
