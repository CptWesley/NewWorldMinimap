import { getNavPath } from '@/logic/navigation/navigation';
import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawMapNavigation(params: MapRendererParameters) {
    const {
        context: ctx,
        centerX,
        centerY,
        offset,
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
            ctx.canvas.width * zoomLevel,
            ctx.canvas.height * zoomLevel);
        const posCorrected = {
            x: pos.x / zoomLevel - offset.x / zoomLevel + centerX,
            y: pos.y / zoomLevel - offset.y / zoomLevel + centerY,
        };

        return renderAsCompass ? rotateAround({ x: centerX, y: centerY }, posCorrected, -angle) : posCorrected;
    }

    const path = getNavPath(playerPosition);
    if (path) {
        const startPos = getCanvasCoord(path[0]);

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 6;
        ctx.moveTo(startPos.x, startPos.y);

        for (let i = 1; i < path.length; i++) {
            const pos = getCanvasCoord(path[i]);
            ctx.lineTo(pos.x, pos.y);
        }

        ctx.stroke();
    }
}
