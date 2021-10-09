const width = 224;
const height = 225;
const tileWidth = 256;
const tileHeight = 256;
const gameMapWidth = 14336;
const gameMapHeight = 14400;
const radius = 2;

export function getTileCoordinatesForWorldCoordinate(x: number, y: number) {
    const totalWidth = width * tileWidth;
    const totalHeight = height * tileHeight;

    const imageX = x / gameMapWidth * totalWidth;
    const imageY = (gameMapHeight - y) / gameMapHeight * totalHeight;

    const tileX = Math.floor(imageX / tileWidth);
    const tileY = Math.floor(imageY / tileHeight);

    return { x: tileX, y: tileY - 1 };
}

function getTileImageUrl(x: number, y: number) {
    return `https://cdn.newworldfans.com/newworldmap/8/${x}/${y}.png`;
}

async function getTileBitmapFromServer(x: number, y: number) {
    const imageUrl = getTileImageUrl(x, y);
    console.log(imageUrl);
    const imageRequest = await fetch(imageUrl, {
        method: 'get',
    });
    const imageBlob = await imageRequest.blob();
    const bitmap = await createImageBitmap(imageBlob);
    return bitmap;
}

function getTileCacheKey(x: number, y: number) {
    return `${x},${y}`;
}

export function toMinimapCoordinate(playerX: number, playerY: number, x: number, y: number) {
    const totalWidth = tileWidth * width;
    const totalHeight = tileHeight * height;
    const { x: tileX, y: tileY } = getTileCoordinatesForWorldCoordinate(playerX, playerY);

    const pixelX = Math.floor(x / gameMapWidth * totalWidth);
    const pixelY = Math.floor((gameMapHeight - y) / gameMapHeight * totalHeight);

    const imageX = pixelX - ((tileX - radius) * tileWidth);
    const imageY = pixelY - ((tileY - radius + 1) * tileHeight);

    return { x: imageX, y: imageY };
}

const tileBitmapCache = new Map<string, Promise<ImageBitmap>>();
export async function getTileBitmap(x: number, y: number) {
    const key = getTileCacheKey(x, y);

    let bitmapPromise = tileBitmapCache.get(key);
    if (!bitmapPromise) {
        bitmapPromise = getTileBitmapFromServer(x, y);
        tileBitmapCache.set(key, bitmapPromise);
    }

    return await bitmapPromise;
}

export function getTiles(x: number, y: number) {
    const dimension = radius * 2 + 1;
    const result: Promise<ImageBitmap>[][] = [];

    const { x: centerX, y: centerY } = getTileCoordinatesForWorldCoordinate(x, y);

    console.log('x: ' + centerX);
    console.log('y: ' + centerY);

    for (let x = 0; x < dimension; ++x) {
        const col: Promise<ImageBitmap>[] = [];
        result.push(col);
        for (let y = 0; y < dimension; ++y) {
            col.push(getTileBitmap(centerX - radius + x, centerY - radius + y));
        }
    }

    return result;
}
