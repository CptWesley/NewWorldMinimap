import { i18n } from '@/i18n';

const temporaryNames = {};

export function getIconNameOverride(category: string, type?: string) {
    if (type) {
        if (temporaryNames[getTemporaryKey(category, type)]) {
            return temporaryNames[getTemporaryKey(category, type)];
        }

        // Categories override
        if (category === 'pois' && i18n.exists(`markers:regions.${type}`)) {
            // if the poi is a region, return region name instead
            return i18n.t(`markers:regions.${type}`);
        }
        if (category === 'npcs' && type && i18n.exists(`markers:regions.${type}`)) {
            // npcs may contain region names
            return i18n.t(`markers:regions.${type}`);
        }

        if (i18n.exists(`markers:custom.markers.${category}.${type}`)) {
            return i18n.t(`markers:custom.markers.${category}.${type}`);
        }

        if (i18n.exists(`markers:${category}.${type}`)) {
            return i18n.t(`markers:${category}.${type}`);
        }
    } else {
        return i18n.t(`markers:custom.categories.${category}`);
    }
    return undefined;
}

export function saveTemporaryIconName(category: string, type: string | undefined, prediction: string) {
    temporaryNames[getTemporaryKey(category, type)] = prediction;
}

function getTemporaryKey(category: string, type: string | undefined) {
    return category + ':' + type;
}
