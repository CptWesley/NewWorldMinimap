import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapFriends(params: MapRendererParameters, iconParams: MapIconRendererParameters, friends: FriendData[]) {
    const {
        context: ctx,
        centerX,
        centerY,
        offset,

        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        angle,
    } = params;

    const {
        mapIconsCache,
        showText,
    } = iconParams;

    for (const friend of friends) {
        const imgPos = toMinimapCoordinate(
            mapCenterPos,
            friend.location,
            ctx.canvas.width * zoomLevel,
            ctx.canvas.height * zoomLevel);
        const icon = mapIconsCache.getFriendIcon();
        if (!icon) { continue; }
        const imgPosCorrected = {
            x: imgPos.x / zoomLevel - offset.x / zoomLevel + centerX,
            y: imgPos.y / zoomLevel - offset.y / zoomLevel + centerY,
        };

        if (renderAsCompass) {
            const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
            ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
        } else {
            ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);
        }

        if (showText) {
            ctx.textAlign = 'center';
            ctx.font = Math.round(icon.height / 1.5) + 'px sans-serif';
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';

            if (renderAsCompass) {
                const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
                ctx.strokeText(friend.name, rotated.x, rotated.y + icon.height);
                ctx.fillText(friend.name, rotated.x, rotated.y + icon.height);
            } else {
                ctx.strokeText(friend.name, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                ctx.fillText(friend.name, imgPosCorrected.x, imgPosCorrected.y + icon.height);
            }
        }
    }
}
