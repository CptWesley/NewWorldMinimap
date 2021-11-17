import { canDrawNavigation } from '@/logic/featureFlags';
import { getNavPath } from '@/logic/navigation/navigation';
import { worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import setLineStyle from './setLineStyle';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawMapNavigation(params: MapRendererParameters): Vector2 | undefined {
    if (!canDrawNavigation) {
        return undefined;
    }

    const {
        context: ctx,
        center,
        renderAsCompass,
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        mapAngle,
    } = params;

    function getCanvasCoord(worldPos: Vector2) {
        const posCorrected = worldCoordinateToCanvas(
            worldPos,
            mapCenterPosition,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        return renderAsCompass
            ? rotateAround(center, posCorrected, -mapAngle)
            : posCorrected;
    }

    let lastPos: Vector2 | undefined = undefined;
    const path = getNavPath(playerPosition);
    if (path && path.length > 0) {
        const startPos = getCanvasCoord(path[0]);

        setLineStyle(ctx);
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
