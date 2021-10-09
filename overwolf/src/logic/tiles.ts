const width = 224;
const height = 225;
const tileWidth = 256;
const tileHeight = 256;
const gameMapWidth = 14336;
const gameMapHeight = 14400;

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
