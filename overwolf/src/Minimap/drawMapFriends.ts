import { ChannelData } from '@/logic/friends';
import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapFriends(params: MapRendererParameters, iconParams: MapIconRendererParameters, channels: ChannelData[]) {
    const {
        context: ctx,
        center,
        unscaledOffset: offset,

        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        angle,
    } = params;

    const {
        mapIconsCache,
        showText,
        iconScale,
    } = iconParams;

    for (const channel of channels) {
        for (const friend of channel.players) {
            const imgPos = toMinimapCoordinate(
                mapCenterPos,
                friend.location,
                ctx.canvas.width,
                ctx.canvas.height,
                zoomLevel,
                1);
            const icon = mapIconsCache.getFriendIcon();
            if (!icon) {
                continue;
            }
            const imgPosCorrected = {
                x: imgPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                y: imgPos.y / zoomLevel - offset.y / zoomLevel + center.y,
            };

            const canvasPosition = renderAsCompass
                ? rotateAround({ x: center.x, y: center.y }, imgPosCorrected, -angle)
                : imgPosCorrected;

            ctx.beginPath();
            ctx.ellipse(canvasPosition.x, canvasPosition.y, 5 * iconScale, 5 * iconScale, 0, 0, 2 * Math.PI);
            ctx.fillStyle = channel.color;
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();

            if (showText) {
                ctx.textAlign = 'center';
                ctx.font = Math.round(icon.height / 1.5) + 'px sans-serif';
                ctx.strokeStyle = '#000';
                ctx.fillStyle = '#fff';

                ctx.strokeText(friend.name, canvasPosition.x, canvasPosition.y + 15 * iconScale);
                ctx.fillText(friend.name, canvasPosition.x, canvasPosition.y + 15 * iconScale);
            }
        }
    }
}
