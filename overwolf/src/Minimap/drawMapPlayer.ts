import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
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
    if (!playerIcon) {
        return;
    }

    const mapPos = toMinimapCoordinate(
        mapCenterPosition,
        playerPosition,
        ctx.canvas.width,
        ctx.canvas.height,
        zoomLevel,
        1);
    const imgPosCorrected = {
        x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
        y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
    };

    if (renderAsCompass) {
        const rotated = rotateAround(center, imgPosCorrected, -angle);
        ctx.drawImage(playerIcon, rotated.x - playerIcon.width / 2, rotated.y - playerIcon.height / 2);
    } else {
        ctx.save();
        ctx.translate(imgPosCorrected.x, imgPosCorrected.y);
        ctx.rotate(angle);
        ctx.translate(-imgPosCorrected.x, -imgPosCorrected.y);
        ctx.drawImage(playerIcon, imgPosCorrected.x - playerIcon.width / 2,
            imgPosCorrected.y - playerIcon.height / 2);
        ctx.restore();
    }
}
