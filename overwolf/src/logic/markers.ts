import { customMarkers } from '../Icons/MapIcons/customMarkers';
import { getIconName } from './icons';
import { loadIconCategory, loadIconType } from './storage';
import { getTileCacheKey, getTileCacheKeyFromWorldCoordinate } from './tiles';

const markersUrl = 'https://www.newworld-map.com/markers.json';

async function getJson() {
    const req = await fetch(markersUrl, {
        method: 'get',
    });
    return await req.json();
}

const fillingPromise = fillCache();

async function fillCache() {
    const tree = await getJson();

    fillCacheWithTree(tree);
    fillCacheWithTree(customMarkers);
}

function fillCacheWithTree(tree: any) {
    for (const [category, catContent] of Object.entries(tree)) {
        if (category === 'areas') {
            continue;
        }

        for (const [type, typeContent] of Object.entries(catContent as any)) {
            for (const [, entryContent] of Object.entries(typeContent as any)) {
                const pos = entryContent as Vector2;
                const tileString = getTileCacheKeyFromWorldCoordinate(pos);

                let markerList = cache.get(tileString);
                if (!markerList) {
                    markerList = [];
                    cache.set(tileString, markerList);
                }

                const marker = {
                    category,
                    type,
                    pos,
                    text: getIconName(type),
                };
                markerList.push(marker);
            }
        }
    }
}

const cache = new Map<string, Marker[]>();
export async function getMarkers(tilePos: Vector2) {
    await fillingPromise;

    const key = getTileCacheKey(tilePos);
    const result = cache.get(key);

    if (!result) {
        return [];
    }

    return result;
}

export async function getDefaultIconSettings() {
    await fillingPromise;

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
