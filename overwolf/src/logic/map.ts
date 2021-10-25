import { getMarkers } from './markers';
import { getTileCache } from './tileCache';
import { getDimensions, getTileCoordinatesForWorldCoordinate, getTileLevel, getTileScale } from './tiles';

const tileCache = getTileCache();

function getMarkersInternal(worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, angle: number) {
    const dimensions = getDimensions(screenWidth * zoomLevel, screenHeight * zoomLevel, angle);

    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos);
    const markers: Marker[] = [];

    for (let x = 0; x < dimensions.x; ++x) {
        for (let y = 0; y < dimensions.y; ++y) {
            const tileX = tilePos.x - Math.floor(dimensions.x / 2) + x;
            const tileY = tilePos.y - Math.floor(dimensions.y / 2) + y;
            const tileCoords: Vector2 = { x: tileX, y: tileY };
            const tileMarkers = getMarkers(tileCoords);
            markers.push(...tileMarkers);
        }
    }

    return markers;
}

function getTilesInternal(worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, angle: number) {
    const tileLevel = getTileLevel(zoomLevel);
    const tileScale = getTileScale(tileLevel);

    const dimensions = getDimensions(screenWidth * zoomLevel / tileScale, screenHeight * zoomLevel / tileScale, angle);

    console.log('Original Dimensions:');
    console.log(dimensions);

    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos, tileScale);

    const tiles: (ImageBitmap | null)[][] = [];

    for (let x = 0; x < dimensions.x; ++x) {
        const col: (ImageBitmap | null)[] = [];
        tiles.push(col);
        for (let y = 0; y < dimensions.y; ++y) {
            const tileX = tilePos.x - Math.floor(dimensions.x / 2) + x;
            const tileY = tilePos.y - Math.floor(dimensions.y / 2) + y;
            const tileCoords: Vector2 = { x: tileX, y: tileY };
            console.log('Tile Coord (' + x + ', ' + y + '):');
            console.log(tileCoords);
            const image = tileCache.getTileBitmap(tileLevel, tileCoords);
            col.push(image.hit ? image.bitmap : null);
        }
    }

    return tiles;
}

export function getMap(worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, angle: number): MapRenderData {
    const tileScale = getTileScale(getTileLevel(zoomLevel));

    return {
        markers: getMarkersInternal(worldPos, screenWidth, screenHeight, zoomLevel, angle),
        tiles: getTilesInternal(worldPos, screenWidth, screenHeight, zoomLevel, angle),
        tileScale,
    };
}
