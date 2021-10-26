import { getNavPath } from '@/logic/navigation/navigation';
import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawMapNavigation(params: MapRendererParameters) {
    const {
        context: ctx,
        center,
        unscaledOffset: offset,
        renderAsCompass,
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        angle,
    } = params;

    function getCanvasCoord(worldPos: Vector2) {
        const pos = toMinimapCoordinate(
            mapCenterPosition,
            worldPos,
            ctx.canvas.width,
            ctx.canvas.height,
            zoomLevel,
            1);
        const posCorrected = {
            x: pos.x / zoomLevel - offset.x / zoomLevel + center.x,
            y: pos.y / zoomLevel - offset.y / zoomLevel + center.y,
        };

        return renderAsCompass ? rotateAround(center, posCorrected, -angle) : posCorrected;
    }

    let lastPos = undefined;
    const path = getNavPath(playerPosition);
    if (path && path.length > 0) {
        const startPos = getCanvasCoord(path[0]);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 6;
        ctx.moveTo(startPos.x, startPos.y);

        for (let i = 1; i < path.length; i++) {
            const pos = getCanvasCoord(path[i]);
            lastPos = pos;
            ctx.lineTo(pos.x, pos.y);
        }

        ctx.stroke();
    }

    return lastPos;
}
