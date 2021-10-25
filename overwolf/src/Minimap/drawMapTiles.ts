import { getMap } from '@/logic/map';
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

    const map = getMap(
        mapCenterPos,
        ctx.canvas.width,
        ctx.canvas.height,
        zoomLevel,
        renderAsCompass ? -angle : 0);

    const tileVisualSize = 256 * map.tileScale;
    const xyz = 256 * (map.tileScale - 1);

    for (let x = 0; x < map.tiles.length; x++) {
        const row = map.tiles[x];
        for (let y = 0; y < row.length; y++) {
            const bitmap = row[y];

            if (!bitmap) {
                continue;
            }

            if (renderAsCompass) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(-angle);
                ctx.translate(-centerX, -centerY);
                ctx.drawImage(bitmap,
                    tileVisualSize / zoomLevel * x + centerX - offset.x / zoomLevel,
                    tileVisualSize / zoomLevel * y + centerY - offset.y / zoomLevel,
                    tileVisualSize / zoomLevel,
                    tileVisualSize / zoomLevel
                );
                ctx.restore();
            } else {
                ctx.drawImage(bitmap,
                    tileVisualSize / zoomLevel * x + centerX - (offset.x + xyz) / zoomLevel,
                    tileVisualSize / zoomLevel * y + centerY - (offset.y + xyz) / zoomLevel,
                    tileVisualSize / zoomLevel,
                    tileVisualSize / zoomLevel
                );
            }
        }
    }

    return map.markers;
}
