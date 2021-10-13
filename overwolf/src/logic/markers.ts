import { getTileCacheKey, getTileCacheKeyFromWorldCoordinate } from './tiles';

const markersUrl = 'https://www.newworld-map.com/markers.json';

async function getJson() {
    const req = await fetch(markersUrl, {
        method: 'get',
    });
    return await req.json();
}

async function fillCache() {
    const tree = await getJson();

    for (const [category, catContent] of Object.entries(tree)) {
        if (category === 'areas') {
            continue;
        }

        for (const [type, typeContent] of Object.entries(catContent as any)) {
            for (const [entry, entryContent] of Object.entries(typeContent as any)) {
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
                };
                markerList.push(marker);
            }
        }
    }

    return;
}

const cache = new Map<string, Marker[]>();
export async function getMarkers(tilePos: Vector2) {
    if (cache.size <= 0) {
        await fillCache();
    }

    const key = getTileCacheKey(tilePos);
    const result = cache.get(key);

    if (!result) {
        return [];
    }

    return result;
}

export async function getDefaultIconSettings() {
    if (cache.size <= 0) {
        await fillCache();
    }

    const categories: any = {};
    const types: any = {};

    const result = {
        categories,
        types,
    };

    cache.forEach(value => {
        value.forEach(marker => {
            if (!categories[marker.category]) {
                categories[marker.category] = { name: marker.category, value: true };
            }

            if (!types[marker.type]) {
                types[marker.type] = { name: marker.type, value: true };
            }
        });
    });

    (categories.npc as IconSetting).value = false;
    (categories.pois as IconSetting).value = false;

    return result;
}
