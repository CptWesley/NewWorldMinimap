import { toMinimapCoordinate } from '@/logic/tiles';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapPlayer(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        center,
        unscaledOffset: offset,

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
            ctx.drawImage(playerIcon, center.x - playerIcon.width / 2, center.y - playerIcon.height / 2);
        } else {
            const mapPos = toMinimapCoordinate(mapCenterPosition, playerPosition, ctx.canvas.width, ctx.canvas.height, zoomLevel, 1);
            const imgPosCorrected = {
                x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
            };
            ctx.save();
            ctx.translate(imgPosCorrected.x, imgPosCorrected.y);
            ctx.rotate(angle);
            ctx.translate(-imgPosCorrected.x, -imgPosCorrected.y);
            ctx.drawImage(playerIcon, imgPosCorrected.x - playerIcon.width / 2,
                imgPosCorrected.y - playerIcon.height / 2);
            ctx.restore();
        }
    }
}
