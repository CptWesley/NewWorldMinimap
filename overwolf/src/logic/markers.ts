import { getIconName } from './icons';
import { loadIconConfiguration } from './storage';
import { getTileMarkerCache } from './tileMarkerCache';

const tileMarkerCache = getTileMarkerCache();

export function getMarkers(tilePos: Vector2) {
    const result = tileMarkerCache.get(tilePos);

    if (!result) {
        return [];
    }

    return result;
}

export async function getDefaultIconSettings() {
    const cache = await tileMarkerCache.markerLoadPromise;

    const categories: IconSettings['categories'] = {};
    const result: IconSettings = { categories };

    cache.forEach(value => {
        value.forEach(marker => {
            if (!categories[marker.category]) {
                categories[marker.category] = {
                    name: getIconName(marker.category),
                    visible: loadIconConfiguration(marker.category, undefined, 'visible'),
                    showLabel: loadIconConfiguration(marker.category, undefined, 'showLabel'),
                    types: {},
                };
            }

            const category = categories[marker.category];

            if (!category.types[marker.type]) {
                category.types[marker.type] = {
                    name: getIconName(marker.category, marker.type),
                    visible: loadIconConfiguration(marker.category, marker.type, 'visible'),
                    showLabel: loadIconConfiguration(marker.category, marker.type, 'showLabel'),
                };
            }
        });
    });

    return result;
}
