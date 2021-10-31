import { getMap } from '@/logic/map';
import { getMinimapTilePosition } from '@/logic/tiles';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawMapTiles(params: MapRendererParameters) {
    const {
        context: ctx,
        center,

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

    const tileScaledOffset = getMinimapTilePosition(
        mapCenterPos,
        mapCenterPos,
        ctx.canvas.width,
        ctx.canvas.height,
        zoomLevel,
        map.tileScale);

    for (let x = 0; x < map.tiles.length; x++) {
        const row = map.tiles[x];
        for (let y = 0; y < row.length; y++) {
            const bitmap = row[y];

            if (!bitmap) {
                continue;
            }

            if (renderAsCompass) {
                ctx.save();
                ctx.translate(center.x, center.y);
                ctx.rotate(-angle);
                ctx.translate(-center.x, -center.y);
                ctx.drawImage(bitmap,
                    tileVisualSize / zoomLevel * x + center.x - tileScaledOffset.x / zoomLevel,
                    tileVisualSize / zoomLevel * y + center.y - tileScaledOffset.y / zoomLevel,
                    tileVisualSize / zoomLevel + 1,
                    tileVisualSize / zoomLevel + 1
                );
                ctx.restore();
            } else {
                ctx.drawImage(bitmap,
                    tileVisualSize / zoomLevel * x + center.x - tileScaledOffset.x / zoomLevel,
                    tileVisualSize / zoomLevel * y + center.y - tileScaledOffset.y / zoomLevel,
                    tileVisualSize / zoomLevel,
                    tileVisualSize / zoomLevel
                );
            }
        }
    }

    return map.markers;
}
