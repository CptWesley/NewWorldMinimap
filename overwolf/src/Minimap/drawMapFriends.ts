import { canDrawFriends } from '@/logic/featureFlags';
import { FriendData } from '@/logic/friends';
import { worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import setTextStyle from './setTextStyle';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

const sliceRotationOffset = -Math.PI / 2;

export default function drawMapFriends(params: MapRendererParameters, iconParams: MapIconRendererParameters, friends: FriendData[]) {
    if (!canDrawFriends) {
        return;
    }

    const {
        context: ctx,
        center,

        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        mapAngle,
    } = params;

    const {
        mapIconsCache,
        showText,
        iconScale,
    } = iconParams;

    for (const friend of friends) {
        const icon = mapIconsCache.getFriendIcon();
        if (!icon) {
            continue;
        }
        const position = worldCoordinateToCanvas(
            friend.location,
            mapCenterPos,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        const canvasPosition = renderAsCompass
            ? rotateAround({ x: center.x, y: center.y }, position, -mapAngle)
            : position;

        const radius = 5 * iconScale;

        // First, draw all the pie slices
        const ellipseSteps = friend.colors.length;
        const ellipseSegmentSize = 2 * Math.PI / ellipseSteps;
        for (let segment = 0; segment < ellipseSteps; ++segment) {
            const segmentStart = segment * ellipseSegmentSize + sliceRotationOffset;
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
            setTextStyle(ctx, iconScale);
            ctx.strokeText(friend.name, canvasPosition.x, canvasPosition.y + 15 * iconScale);
            ctx.fillText(friend.name, canvasPosition.x, canvasPosition.y + 15 * iconScale);
        }
    }
}
