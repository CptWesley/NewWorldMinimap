import { getIconName } from '@/logic/icons';
import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapMarkers(params: MapRendererParameters, iconParams: MapIconRendererParameters, markers: Marker[]) {
    const {
        context: ctx,
        centerX,
        centerY,
        offset,

        playerPosition: playerPosition,
        mapCenterPosition: mapCenterPos,
        renderAsCompass,
        zoomLevel,
        angle,
    } = params;

    const {
        mapIconsCache,
        settings: iconSettings,
        showText,
        iconScale,
    } = iconParams;

    if (!iconSettings) {
        return;
    }

    for (const marker of markers) {
        const catSettings = iconSettings.categories[marker.category];
        if (!catSettings || !catSettings.visible) {
            continue;
        }

        const typeSettings = catSettings.types[marker.type];
        if (typeSettings && !typeSettings.visible) {
            continue;
        }

        const mapPos = toMinimapCoordinate(
            renderAsCompass ? playerPosition : mapCenterPos,
            marker.pos,
            ctx.canvas.width * zoomLevel,
            ctx.canvas.height * zoomLevel);
        const icon = mapIconsCache.getIcon(marker.type, marker.category);
        if (!icon) { continue; }
        const imgPosCorrected = {
            x: mapPos.x / zoomLevel - offset.x / zoomLevel + centerX,
            y: mapPos.y / zoomLevel - offset.y / zoomLevel + centerY,
        };

        if (renderAsCompass) {
            const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
            ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
        } else {
            ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);
        }

        if (showText && catSettings.showLabel && typeSettings.showLabel) {
            ctx.textAlign = 'center';
            ctx.font = Math.round(iconScale * 10) + 'px sans-serif';
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';

            const markerText = getIconName(marker.category, marker.name ?? marker.type);

            if (renderAsCompass) {
                const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
                ctx.strokeText(markerText, rotated.x, rotated.y + icon.height);
                ctx.fillText(markerText, rotated.x, rotated.y + icon.height);
            } else {
                ctx.strokeText(markerText, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                ctx.fillText(markerText, imgPosCorrected.x, imgPosCorrected.y + icon.height);
            }
        }
    }
}
