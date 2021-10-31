import { getTileCacheKey } from './tileCache';

const width = 224;
const height = 224;
const tileWidth = 256;
const tileHeight = 256;
const gameMapWidth = 14336;
const gameMapHeight = 14336;

export function getTileCoordinatesForWorldCoordinate(worldPos: Vector2, tileScale: number) {
    // Gets the dimensions of the map, in pixel space
    const totalWidth = width * tileWidth / tileScale;
    const totalHeight = height * tileHeight / tileScale;

    // Converts the world position to pixel space
    const imageX = worldPos.x / gameMapWidth * totalWidth;
    const imageY = (gameMapHeight - worldPos.y) / gameMapHeight * totalHeight;

    // Converts the pixel position to a tile position
    const tileX = Math.floor(imageX / tileWidth);
    const tileY = Math.floor(imageY / tileHeight);

    return { x: tileX, y: tileY };
}

export function getTileCacheKeyFromWorldCoordinate(worldPos: Vector2) {
    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos, 1);
    return getTileCacheKey(8, tilePos);
}

export function getDimensions(screenWidth: number, screenHeight: number, angle?: number) {
    if (!angle) {
        angle = 0;
    }

    const x = Math.ceil(screenWidth / tileWidth / 2) * 2 + 3;
    const y = Math.ceil(screenHeight / tileHeight / 2) * 2 + 3;

    if (angle === 0) {
        return { x, y };
    }

    // TODO: Improve map loading.

    return { x, y };
}

export function getMinimapTilePosition(playerWorldPos: Vector2, worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, tileScale: number) {
    // Gets the number of tiles that should be rendered in X/Y
    const dimensions = getDimensions(screenWidth * zoomLevel / tileScale, screenHeight * zoomLevel / tileScale);

    // Gets the dimensions of the map, in pixel space
    const totalWidth = tileWidth * width / tileScale;
    const totalHeight = tileHeight * height / tileScale;

    const tileCoordinates = getTileCoordinatesForWorldCoordinate(playerWorldPos, tileScale);
    const { x: tileX, y: tileY } = tileCoordinates;

    // Convert world position to pixel space
    const pixelX = worldPos.x / gameMapWidth * totalWidth;
    const pixelY = (gameMapHeight - worldPos.y) / gameMapHeight * totalHeight;

    const imageX = pixelX - ((tileX - Math.floor(dimensions.x / 2)) * tileWidth);
    const imageY = pixelY - ((tileY - Math.floor(dimensions.y / 2)) * tileHeight);

    return { x: imageX * tileScale, y: imageY * tileScale };
}

/**
 * Converts world coordinates to canvas coordinates.
 * @param worldPos The world position to convert to canvas coordinates.
 * @param centerPos The world position the map is centered on.
 * @param zoomLevel The current zoom level of the canvas.
 * @param canvasWidth The width of the canvas.
 * @param canvasHeight The height of the canvas.
 * @returns The computed canvas coordinates.
 */
export function worldCoordinateToCanvas(worldPos: Vector2, centerPos: Vector2, zoomLevel: number, canvasWidth: number, canvasHeight: number): Vector2 {
    // Compute the distance between worldPos and centerPos.
    // Unit: world
    const centerDistanceX = centerPos.x - worldPos.x;
    const centerDistanceY = centerPos.y - worldPos.y;

    // Compute the scaling factor to go from world space to pixel space.
    // Unit: imagePixel / world
    const scaleWorldToCanvasX = (width * tileWidth) / gameMapWidth;
    const scaleWorldToCanvasY = (height * tileHeight) / gameMapHeight;

    // Compute the actual scaling factor, taking zoom into account.
    // Unit: (imagePixel / world) / (imagePixel / canvasPixel) = canvasPixel / world
    const scaleX = scaleWorldToCanvasX / zoomLevel;
    const scaleY = scaleWorldToCanvasY / zoomLevel;

    // Compute the center of the canvas.
    // Unit: canvasPixel
    const centerCanvasX = canvasWidth / 2;
    const centerCanvasY = canvasHeight / 2;

    // Compute the canvas coordinates.
    // Unit: canvasPixel - (world * (canvasPixel / world)) = canvasPixel
    const x = centerCanvasX - (centerDistanceX * scaleX);
    // Use addition, because the Y axis is inverted (and double minus = plus)
    const y = centerCanvasY + (centerDistanceY * scaleY);

    return { x, y };
}

/**
 * Converts canvas coordinates to world coordinates.
 * @param worldPos The world position to convert to canvas coordinates.
 * @param centerPos The world position the map is centered on.
 * @param zoomLevel The current zoom level of the canvas.
 * @param canvasWidth The width of the canvas.
 * @param canvasHeight The height of the canvas.
 * @returns The computed canvas coordinates.
 */
export function canvasCoordinateToWorld(canvasPos: Vector2, centerPos: Vector2, zoomLevel: number, canvasWidth: number, canvasHeight: number): Vector2 {
    // Compute the center of the canvas.
    // Unit: canvasPixel
    const centerCanvasX = canvasWidth / 2;
    const centerCanvasY = canvasHeight / 2;

    // Compute the distance between the center of the canvas and canvasPos.
    // Unit: canvasPixel - canvasPixel = canvasPixel
    const centerDistanceX = centerCanvasX - canvasPos.x;
    const centerDistanceY = centerCanvasY - canvasPos.y;

    // Compute the scaling factor to go from pixel space to world space.
    // Unit: world / imagePixel
    const scaleCanvasToWorldX = gameMapWidth / (width * tileWidth);
    const scaleCanvasToWorldY = gameMapHeight / (height * tileHeight);

    // Compute the actual scaling factor, taking zoom into account.
    // Unit: (world / imagePixel) * (imagePixel / canvasPixel) = world / canvasPixel
    const scaleX = scaleCanvasToWorldX * zoomLevel;
    const scaleY = scaleCanvasToWorldY * zoomLevel;

    // Compute the canvas coordinates.
    // Unit: world - (canvasPixel * (world / canvasPixel)) = world
    const x = centerPos.x - (centerDistanceX * scaleX);
    // Use addition, because the Y axis is inverted (and double minus = plus)
    const y = centerPos.y + (centerDistanceY * scaleY);

    return { x, y };
}

export function getTileLevel(zoomLevel: number): TileLevel {
    if (zoomLevel < 2) {
        return 8;
    }

    if (zoomLevel < 4) {
        return 7;
    }

    if (zoomLevel < 8) {
        return 6;
    }

    if (zoomLevel < 16) {
        return 5;
    }

    if (zoomLevel < 32) {
        return 4;
    }

    if (zoomLevel < 64) {
        return 3;
    }

    return 2;
}

export function getTileScale(tileLevel: TileLevel): TileScale {
    return 2 ** (8 - tileLevel) as TileScale;
}
