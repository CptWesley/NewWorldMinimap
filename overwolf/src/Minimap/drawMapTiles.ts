import { getMapTiles } from '@/logic/map';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawMapTiles(params: MapRendererParameters) {
    const {
        context: ctx,
        centerX,
        centerY,
        offset,

        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        angle,
    } = params;

    const tiles = getMapTiles(
        mapCenterPos,
        ctx.canvas.width * zoomLevel,
        ctx.canvas.height * zoomLevel,
        renderAsCompass ? -angle : 0);

    let foundMarkers: Marker[] = [];

    for (let x = 0; x < tiles.length; x++) {
        const row = tiles[x];
        for (let y = 0; y < row.length; y++) {
            const tile = row[y];
            const bitmap = tile.image;

            if (!bitmap) {
                continue;
            }

            if (renderAsCompass) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(-angle);
                ctx.translate(-centerX, -centerY);
                ctx.drawImage(bitmap,
                    bitmap.width / zoomLevel * x + centerX - offset.x / zoomLevel,
                    bitmap.height / zoomLevel * y + centerY - offset.y / zoomLevel,
                    bitmap.width / zoomLevel,
                    bitmap.height / zoomLevel
                );
                ctx.restore();
            } else {
                ctx.drawImage(bitmap,
                    bitmap.width / zoomLevel * x + centerX - offset.x / zoomLevel,
                    bitmap.height / zoomLevel * y + centerY - offset.y / zoomLevel,
                    bitmap.width / zoomLevel,
                    bitmap.height / zoomLevel
                );
            }

            foundMarkers = foundMarkers.concat(tile.markers);
        }
    }

    return foundMarkers;
}