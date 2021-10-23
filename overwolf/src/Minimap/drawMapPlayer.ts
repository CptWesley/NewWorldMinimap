import { toMinimapCoordinate } from '@/logic/tiles';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapPlayer(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        centerX,
        centerY,
        offset,

        playerPosition,
        mapCenterPosition,
        renderAsCompass,
        zoomLevel,
        angle,
    } = params;

    const {
        mapIconsCache,
    } = iconParams;

    const playerIcon = mapIconsCache.getPlayerIcon();

    if (playerIcon) {
        if (renderAsCompass) {
            ctx.drawImage(playerIcon, centerX - playerIcon.width / 2, centerY - playerIcon.height / 2);
        } else {
            const mapPos = toMinimapCoordinate(mapCenterPosition, playerPosition, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
            const imgPosCorrected = {
                x: mapPos.x / zoomLevel - offset.x / zoomLevel + centerX,
                y: mapPos.y / zoomLevel - offset.y / zoomLevel + centerY,
            };
            ctx.save();
            ctx.translate(imgPosCorrected.x, imgPosCorrected.y);
            ctx.rotate(angle);
            ctx.translate(-imgPosCorrected.x, -imgPosCorrected.y);
            ctx.drawImage(playerIcon, imgPosCorrected.x - playerIcon.width / 2, imgPosCorrected.y - playerIcon.height / 2);
            ctx.restore();
        }
    }
}
