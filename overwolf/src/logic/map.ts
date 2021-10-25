import { getMarkers } from './markers';
import { getTileCache } from './tileCache';
import { getDimensions, getTileCoordinatesForWorldCoordinate, getTileLevel, getTileScale } from './tiles';

const tileCache = getTileCache();

function getMarkersInternal(worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, angle: number) {
    const dimensions = getDimensions(screenWidth * zoomLevel, screenHeight * zoomLevel, angle);

    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos, 1);
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

    const centerTilePos = getTileCoordinatesForWorldCoordinate(worldPos, tileScale);
    const xStart = -Math.floor(dimensions.x / 2);
    const yStart = -Math.floor(dimensions.y / 2);

    const xEnd = xStart + dimensions.x;
    const yEnd = yStart + dimensions.y;

    const tiles: (ImageBitmap | null)[][] = [];

    for (let x = xStart; x < xEnd; ++x) {
        const col: (ImageBitmap | null)[] = [];
        tiles.push(col);
        for (let y = yStart; y < yEnd; ++y) {
            const tileX = centerTilePos.x + x;
            const tileY = centerTilePos.y + y;
            const tileCoords: Vector2 = { x: tileX, y: tileY };
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
