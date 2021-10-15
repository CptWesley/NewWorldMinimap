import { customMarkers } from '../Icons/MapIcons/customMarkers';
import { getIconName } from './icons';
import { loadIconCategory, loadIconType } from './storage';
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

    const categories: any = {};
    const result = { categories };

    cache.forEach(value => {
        value.forEach(marker => {
            if (!categories[marker.category]) {
                categories[marker.category] = { name: getIconName(marker.category), value: loadIconCategory(marker.category), types: {} };
            }

            const category = categories[marker.category];

            if (!category.types[marker.type]) {
                category.types[marker.type] = { name: getIconName(marker.type), value: loadIconType(marker.type) };
            }
        });
    });

    return result;
}
