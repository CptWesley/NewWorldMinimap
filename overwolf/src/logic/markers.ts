import AppPlatform from './platform';
import { loadIconConfiguration } from './storage';

const tileMarkerCache = AppPlatform.state.tileMarkerCache;

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
                    category: marker.category,
                    visible: loadIconConfiguration(marker.category, undefined, 'visible'),
                    showLabel: loadIconConfiguration(marker.category, undefined, 'showLabel'),
                    types: {},
                };
            }

            // The ! assertion is allowed because the previous if-block sets it
            const category = categories[marker.category]!;

            if (!category.types[marker.type]) {
                category.types[marker.type] = {
                    category: marker.category,
                    type: marker.type,
                    visible: loadIconConfiguration(marker.category, marker.type, 'visible'),
                    showLabel: loadIconConfiguration(marker.category, marker.type, 'showLabel'),
                };
            }
        });
    });

    return result;
}
