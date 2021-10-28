import { FriendData } from '@/logic/friends';
import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapFriends(params: MapRendererParameters, iconParams: MapIconRendererParameters, friends: FriendData[]) {
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

    for (const friend of friends) {
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

        const radius = 5 * iconScale;

        // First, draw all the pie slices
        const ellipseSteps = friend.colors.length;
        const ellipseSegmentSize = 2 * Math.PI / ellipseSteps;
        for (let segment = 0; segment < ellipseSteps; ++segment) {
            const segmentStart = segment * ellipseSegmentSize;
            const segmentEnd = segmentStart + ellipseSegmentSize;
            ctx.beginPath();
            ctx.moveTo(canvasPosition.x, canvasPosition.y); // center point
            ctx.arc(canvasPosition.x, canvasPosition.y, radius, segmentStart, segmentEnd); // draw outer arc
            ctx.closePath(); // close pie slice
            ctx.fillStyle = friend.colors[segment];
            ctx.fill();
        }
        // Then, draw the outline
        ctx.beginPath();
        ctx.ellipse(canvasPosition.x, canvasPosition.y, radius, radius, 0, 0, 2 * Math.PI);
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
