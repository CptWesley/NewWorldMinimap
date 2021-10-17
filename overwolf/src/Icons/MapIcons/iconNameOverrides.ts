import { customCategoryNamesEn, customNamesEn, iconNamesEn } from './names/en';

const temporaryNames = {};

export function getIconNameOverride(category: string, type?: string) {
    if (type) {
        if (temporaryNames[getTemporaryKey(category, type)]) {
            return temporaryNames[getTemporaryKey(category, type)];
        }

        // Categories override
        if (category === 'pois' && iconNamesEn['regions'][type]) {
            // if the poi is a region, return region name instead
            return iconNamesEn['regions'][type];
        }
        if (category === 'npcs' && type && iconNamesEn['regions'][type]) {
            // npcs may contain region names
            return iconNamesEn['regions'][type];
        }

        if (customNamesEn[category] && customNamesEn[category][type]) {
            return customNamesEn[category][type];
        }
        if (iconNamesEn[category]) {
            return iconNamesEn[category][type];
        }
    } else {
        return customCategoryNamesEn[category];
    }
    return undefined;
}

export function saveTemporaryIconName(category: string, type: string | undefined, prediction: string) {
    temporaryNames[getTemporaryKey(category, type)] = prediction;
}

function getTemporaryKey(category: string, type: string | undefined) {
    return category + ':' + type;
}
