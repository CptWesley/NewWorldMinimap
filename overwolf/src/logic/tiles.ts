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

export function getDimensions(screenWidth: number, screenHeight: number, zoomLevel: number, tileScale: TileScale, angle?: number) {
    if (!angle) {
        angle = 0;
    }

    const width = screenWidth * zoomLevel / tileScale;
    const height = screenHeight * zoomLevel / tileScale;

    const x = Math.ceil(width / tileWidth / 2) * 2 + 3;
    const y = Math.ceil(height / tileHeight / 2) * 2 + 3;

    if (angle === 0) {
        return { x, y };
    }

    // TODO: Improve map loading.

    return { x, y };
}

export function toMinimapCoordinate(playerWorldPos: Vector2, worldPos: Vector2, screenWidth: number, screenHeight: number, zoomLevel: number, tileScale: TileScale) {
    // Gets the number of tiles that should be rendered in X/Y
    const dimensions = getDimensions(screenWidth, screenHeight, zoomLevel, tileScale);

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

//    Function: canvasToMinimapCoordinate(canvasPos, centerPos, zoomLevel, screenWidth, screenHeight)
//    Translates a canvas position vector to a vector in worldspace. Respecting zoom provided.
//
//    Example Usage:
//       x = mouse.pageX;
//       y = mouse.pageY;
//       // rotate for compass angle if required prior to translating
//       const rotatedSourceVector = rotateAround({ x: centerX, y: centerY }, {x, y}, angle);
//       const pos = renderAsCompass ? rotatedSourceVector : {x,y};
//       const imgPos = canvasToMinimap(pos, mapCenterPos, zoomLevel, ctx.canvas.width, ctx.canvas.height);
//
export function canvasToMinimapCoordinate(canvasPos: Vector2, centerPos: Vector2, zoomLevel: number, screenWidth: number, screenHeight: number) {
    const totalWidth = tileWidth * width;
    const totalHeight = tileHeight * height;
    const viewWidthInWorld = (screenWidth * zoomLevel * gameMapWidth) / totalWidth;
    const viewHeightInWorld = (screenHeight * zoomLevel * gameMapHeight) / totalHeight;

    const x = canvasPos.x * zoomLevel;
    const y = canvasPos.y * zoomLevel;

    const worldOffsetX = (x * gameMapWidth) / totalWidth;
    const finalPosX = worldOffsetX + (centerPos.x - viewWidthInWorld / 2);

    const workdOffsetY = gameMapHeight - (gameMapHeight - (y * gameMapHeight) / totalHeight);
    const finalPosY = (centerPos.y + viewHeightInWorld / 2) - workdOffsetY;

    return { x: finalPosX, y: finalPosY };
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
