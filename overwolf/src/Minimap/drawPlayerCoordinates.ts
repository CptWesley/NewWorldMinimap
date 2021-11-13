import { worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import setTextStyle from './setTextStyle';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawPlayerCoordinates(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        showPlayerCoordinates,
        renderAsCompass,
        mapAngle,
        center,
    } = params;

    const {
        iconScale,
    } = iconParams;

    if (showPlayerCoordinates) {
        const playerPosString = `[${playerPosition.x.toFixed(3)}, ${playerPosition.y.toFixed(3)}]`;
        ctx.fillStyle = '#fff';

        const position = worldCoordinateToCanvas(
            playerPosition,
            mapCenterPosition,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );
        const canvasPosition = renderAsCompass
            ? rotateAround(center, position, -mapAngle)
            : position;

        const textX = canvasPosition.x;
        const textY = canvasPosition.y + 20 * iconScale;

        setTextStyle(ctx, iconScale);

        ctx.strokeText(playerPosString, textX, textY);
        ctx.fillText(playerPosString, textX, textY);
    }

}

