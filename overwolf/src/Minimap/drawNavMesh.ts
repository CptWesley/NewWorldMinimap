import { roadGraph } from '@/logic/navigation/roadGraph';
import { worldCoordinateToCanvas } from '@/logic/tiles';
import { onCanvas, rotateAround } from '@/logic/util';
import setNavMeshStyle from './setNavMeshStyle';
import setTextStyle from './setTextStyle';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawNavMesh(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        center,
        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        mapAngle,
        showNavMesh,
    } = params;

    if (!showNavMesh) {
        return;
    }

    const {
        showText,
        iconScale,
    } = iconParams;

    const graph = roadGraph;

    setNavMeshStyle(ctx);
    for (let i = 0; i < graph.max; i++) {
        const node = graph[i];

        if (!node) {
            continue;
        }

        const tempPos = worldCoordinateToCanvas(
            node.position,
            mapCenterPos,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        const position = renderAsCompass ? rotateAround(center, tempPos, -mapAngle) : tempPos;

        if (!onCanvas(position, 8, 8, ctx.canvas.width, ctx.canvas.height)) {
            continue;
        }

        if (zoomLevel < 4) {
            for (const n of node.neighbors) {
                const neighbor = graph[n];
                if (!neighbor) {
                    continue;
                }

                const tempNPos = worldCoordinateToCanvas(
                    neighbor.position,
                    mapCenterPos,
                    zoomLevel,
                    ctx.canvas.width,
                    ctx.canvas.height,
                );

                const nPos = renderAsCompass ? rotateAround(center, tempNPos, -mapAngle) : tempNPos;

                ctx.beginPath();
                ctx.moveTo(position.x, position.y);
                ctx.lineTo(nPos.x, nPos.y);
                ctx.stroke();
            }

            if (showText) {
                setTextStyle(ctx, iconScale);

                const textX = position.x;
                const textY = position.y + 20 * iconScale;

                ctx.strokeText(i.toString(), textX, textY);
                ctx.fillText(i.toString(), textX, textY);

                setNavMeshStyle(ctx);
            }
        }

        ctx.fillRect(position.x - 4, position.y - 4, 8, 8);
    }
}
