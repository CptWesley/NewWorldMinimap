import { worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapPlayer(params: MapRendererParameters, iconParams: MapIconRendererParameters) {
    const {
        context: ctx,
        center,

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

    const position = worldCoordinateToCanvas(
        playerPosition,
        mapCenterPosition,
        zoomLevel,
        ctx.canvas.width,
        ctx.canvas.height,
    );

    if (renderAsCompass) {
        const rotated = rotateAround(center, position, -angle);
        ctx.drawImage(playerIcon, rotated.x - playerIcon.width / 2, rotated.y - playerIcon.height / 2);
    } else {
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(angle);
        ctx.translate(-position.x, -position.y);
        ctx.drawImage(playerIcon, position.x - playerIcon.width / 2,
            position.y - playerIcon.height / 2);
        ctx.restore();
    }
}
