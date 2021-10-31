import { toMinimapCoordinate } from '@/logic/tiles';
import setTextStyle from './setTextStyle';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawPlayerCoordinates(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        center,
        unscaledOffset: offset,
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        showPlayerCoordinates,
    } = params;

    const {
        iconScale,
    } = iconParams;

    if (showPlayerCoordinates) {
        const playerPosString = `[${playerPosition.x.toFixed(3)}, ${playerPosition.y.toFixed(3)}]`;
        ctx.fillStyle = '#fff';

        const mapPos = toMinimapCoordinate(mapCenterPosition, playerPosition, ctx.canvas.width, ctx.canvas.height, zoomLevel, 1);
        const imgPosCorrected = {
            x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
            y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
        };

        const textX = imgPosCorrected.x;
        const textY = imgPosCorrected.y + 20 * iconScale;

        setTextStyle(ctx, iconScale);

        ctx.strokeText(playerPosString, textX, textY);
        ctx.fillText(playerPosString, textX, textY);
    }

}

