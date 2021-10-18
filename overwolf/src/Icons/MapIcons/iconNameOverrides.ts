import i18next from 'i18next';

const temporaryNames = {};

i18next.loadNamespaces('markers');

export function getIconNameOverride(category: string, type?: string) {
    if (type) {
        if (temporaryNames[getTemporaryKey(category, type)]) {
            return temporaryNames[getTemporaryKey(category, type)];
        }

        // Categories override
        if (category === 'pois' && i18next.exists(`markers:regions.${type}`)) {
            // if the poi is a region, return region name instead
            return i18next.t(`markers:regions.${type}`);
        }
        if (category === 'npcs' && type && i18next.exists(`markers:regions.${type}`)) {
            // npcs may contain region names
            return i18next.t(`markers:regions.${type}`);
        }

        if (i18next.exists(`markers:custom.markers.${category}.${type}`)) {
            return i18next.t(`markers:custom.markers.${category}.${type}`);
        }

        if (i18next.exists(`markers:${category}.${type}`)) {
            return i18next.t(`markers:${category}.${type}`);
        }
    } else {
        return i18next.t(`markers:custom.categories.${category}`);
    }
    return undefined;
}

export function saveTemporaryIconName(category: string, type: string | undefined, prediction: string) {
    temporaryNames[getTemporaryKey(category, type)] = prediction;
}

function getTemporaryKey(category: string, type: string | undefined) {
    return category + ':' + type;
}
