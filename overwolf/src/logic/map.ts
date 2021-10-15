import { getMarkers } from './markers';
import { getTileCache } from './tileCache';
import { getDimensions, getTileCoordinatesForWorldCoordinate } from './tiles';

const tileCache = getTileCache();

export function getMapTiles(worldPos: Vector2, screenWidth: number, screenHeight: number, angle: number) {
    const dimensions = getDimensions(screenWidth, screenHeight, angle);
    const result: Tile[][] = [];

    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos);

    for (let x = 0; x < dimensions.x; ++x) {
        const col: Tile[] = [];
        result.push(col);
        for (let y = 0; y < dimensions.y; ++y) {
            const tileX = tilePos.x - Math.floor(dimensions.x / 2) + x;
            const tileY = tilePos.y - Math.floor(dimensions.y / 2) + y;
            const tileCoords: Vector2 = { x: tileX, y: tileY };
            const image = tileCache.getTileBitmap(tileCoords);
            const markers = getMarkers(tileCoords);
            const tile: Tile = {
                image: image.hit ? image.bitmap : null,
                markers,
            };
            col.push(tile);
        }
    }

    return result;
}
