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
    const result = { categories };

    cache.forEach(value => {
        value.forEach(marker => {
            if (!categories[marker.category]) {
                categories[marker.category] = { name: marker.category, value: true, types: {} };
            }

            const category = categories[marker.category];

            if (!category.types[marker.type]) {
                category.types[marker.type] = { name: marker.type, value: true };
            }
        });
    });
    configureDefaultValues(result);

    return result;
}

function configureDefaultValues(settings: IconSettings) {
    settings.categories.npc.value = false;
    settings.categories.pois.value = false;

    settings.categories.npc.name = 'NPCs';
    settings.categories.chests.name = 'Chests';
    settings.categories.documents.name = 'Documents';
    settings.categories.essences.name = 'Essences';
    settings.categories.fishing.name = 'Fish';
    settings.categories.monsters.name = 'Creatures';
    settings.categories.ores.name = 'Ores';
    settings.categories.plants.name = 'Plants';
    settings.categories.pois.name = 'Places of Interest';
    settings.categories.woods.name = 'Trees';
}
