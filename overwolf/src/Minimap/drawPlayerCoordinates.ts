import { toMinimapCoordinate } from '@/logic/tiles';
import { MapRendererParameters } from './useMinimapRenderer';

export default function drawPlayerCoordinates(params: MapRendererParameters) {
    const {
        context: ctx,
        center,
        unscaledOffset: offset,
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        showPlayerCoordinates,
    } = params;

    if (showPlayerCoordinates) {
        const playerPosString = `[${playerPosition.x.toFixed(3)}, ${playerPosition.y.toFixed(3)}]`;
        ctx.fillStyle = '#fff';

        const mapPos = toMinimapCoordinate(mapCenterPosition, playerPosition, ctx.canvas.width, ctx.canvas.height, zoomLevel, 1);
        const imgPosCorrected = {
            x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
            y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
        };

        const textX = imgPosCorrected.x - 50;
        const textY = imgPosCorrected.y + 30;
        console.log(textX, textY);
        ctx.strokeText(playerPosString, textX, textY);
        ctx.fillText(playerPosString, textX, textY);
    }

}

