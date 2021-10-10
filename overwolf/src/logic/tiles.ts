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
    console.log(imageUrl);
    const imageRequest = await fetch(imageUrl, {
        method: 'get',
    });
    const imageBlob = await imageRequest.blob();
    const bitmap = await createImageBitmap(imageBlob);
    return bitmap;
}

function getTileCacheKey(tilePos: Vector2) {
    return `${tilePos.x},${tilePos.y}`;
}

export function toMinimapCoordinate(playerWorldPos: Vector2, worldPos: Vector2, radius: number) {
    const totalWidth = tileWidth * width;
    const totalHeight = tileHeight * height;
    const { x: tileX, y: tileY } = getTileCoordinatesForWorldCoordinate(playerWorldPos);

    const pixelX = Math.floor(worldPos.x / gameMapWidth * totalWidth);
    const pixelY = Math.floor((gameMapHeight - worldPos.y) / gameMapHeight * totalHeight);

    const imageX = pixelX - ((tileX - radius) * tileWidth);
    const imageY = pixelY - ((tileY - radius + 1) * tileHeight);

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

export function getTiles(worldPos: Vector2, radius: number) {
    const dimension = radius * 2 + 1;
    const result: Promise<ImageBitmap>[][] = [];

    const tilePos = getTileCoordinatesForWorldCoordinate(worldPos);

    for (let x = 0; x < dimension; ++x) {
        const col: Promise<ImageBitmap>[] = [];
        result.push(col);
        for (let y = 0; y < dimension; ++y) {
            col.push(getTileBitmap({ x: tilePos.x - radius + x, y: tilePos.y - radius + y }));
        }
    }

    return result;
}
