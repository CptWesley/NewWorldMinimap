import { getMarkers } from './markers';

const width = 224;
const height = 225;
const tileWidth = 256;
const tileHeight = 256;
const gameMapWidth = 14336;
const gameMapHeight = 14400;

export function getTileCoordinatesForWorldCoordinate(worldPos: Vector2) {
    const totalWidth = width * tileWidth;
    const totalHeight = height * tileHeight;

    const imageX = worldPos.x / gameMapWidth * totalWidth;
    const imageY = (gameMapHeight - worldPos.y) / gameMapHeight * totalHeight;

    const tileX = Math.floor(imageX / tileWidth);
    const tileY = Math.floor(imageY / tileHeight);

    return { x: tileX, y: tileY - 1 };
}

function getTileImageUrl(tilePos: Vector2) {
    return `https://cdn.newworldfans.com/newworldmap/8/${tilePos.x}/${tilePos.y}.png`;
}

async function getTileBitmapFromServer(tilePos: Vector2) {
    const imageUrl = getTileImageUrl(tilePos);
    const imageRequest = await fetch(imageUrl, {
        method: 'get',
    });
    const imageBlob = await imageRequest.blob();
    const bitmap = await createImageBitmap(imageBlob);
    return bitmap;
}

export function getTileCacheKey(tilePos: Vector2) {
    return `${tilePos.x},${tilePos.y}`;
}

export function getTileCacheKeyFromWorldCoordinate(worldPos: Vector2) {
    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos);
    return getTileCacheKey(tilePos);
}

function getDimensions(screenWidth: number, screenHeight: number, angle?: number) {
    if (!angle) {
        angle = 0;
    }

    const x = Math.ceil(screenWidth / tileWidth / 2) * 2 + 1;
    const y = Math.ceil(screenHeight / tileHeight / 2) * 2 + 1;

    if (angle === 0) {
        return { x, y };
    }

    // TODO: Improve map loading.

    return { x, y };
}

export function toMinimapCoordinate(playerWorldPos: Vector2, worldPos: Vector2, screenWidth: number, screenHeight: number) {
    const dimensions = getDimensions(screenWidth, screenHeight);
    const totalWidth = tileWidth * width;
    const totalHeight = tileHeight * height;
    const { x: tileX, y: tileY } = getTileCoordinatesForWorldCoordinate(playerWorldPos);

    const pixelX = Math.floor(worldPos.x / gameMapWidth * totalWidth);
    const pixelY = Math.floor((gameMapHeight - worldPos.y) / gameMapHeight * totalHeight);

    const imageX = pixelX - ((tileX - Math.floor(dimensions.x / 2)) * tileWidth);
    const imageY = pixelY - ((tileY - Math.floor(dimensions.y / 2) + 1) * tileHeight);

    return { x: imageX, y: imageY };
}

const tileBitmapCache = new Map<string, Promise<ImageBitmap>>();
export async function getTileBitmap(pos: Vector2) {
    const key = getTileCacheKey(pos);

    let bitmapPromise = tileBitmapCache.get(key);
    if (!bitmapPromise) {
        bitmapPromise = getTileBitmapFromServer(pos);
        tileBitmapCache.set(key, bitmapPromise);
    }

    return await bitmapPromise;
}

export function getTiles(worldPos: Vector2, screenWidth: number, screenHeight: number, angle: number) {
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
            const image = getTileBitmap(tileCoords);
            const markers = getMarkers(tileCoords);
            const tile: Tile = {
                image,
                markers,
            };
            col.push(tile);
        }
    }

    return result;
}

export function toWorldCoordinate(playerWorldPos: Vector2, screenPos: Vector2, screenWidth: number, screenHeight: number) {
    const dimensions = getDimensions(screenWidth, screenHeight);
    const totalWidth = tileWidth * width;
    const totalHeight = tileHeight * height;
    const { x: tileX, y: tileY } = getTileCoordinatesForWorldCoordinate(playerWorldPos);

    const pixelX = Math.floor(screenPos.x * gameMapWidth / totalWidth);
    const pixelY = Math.floor((screenHeight - screenPos.y) * gameMapHeight / totalHeight);

    const worldX = pixelX - ((tileX - Math.floor(dimensions.x / 2)) / tileWidth);
    const worldY = pixelY - ((tileY - Math.floor(dimensions.y / 2) + 1) / tileHeight);

    return { x: pixelX, y: pixelY };
}
