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

    for (const [cat, catContent] of Object.entries(tree)) {
        if (cat == 'areas') {
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
                    category: cat,
                    type: type,
                    pos: pos,
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

    return result as Marker[];
}