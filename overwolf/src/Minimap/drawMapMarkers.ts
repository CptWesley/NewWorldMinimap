import { toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import drawMapLabel from '@/Minimap/drawMapLabels';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapMarkers(params: MapRendererParameters, iconParams: MapIconRendererParameters, markers: Marker[]) {
    const {
        context: ctx,
        center,
        unscaledOffset,
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
            mapCenterPos,
            marker.pos,
            ctx.canvas.width,
            ctx.canvas.height,
            zoomLevel,
            1);
        const icon = mapIconsCache.getIcon(marker.type, marker.category);
        if (!icon) {
            continue;
        }
        const imgPosCorrected = {
            x: mapPos.x / zoomLevel - unscaledOffset.x / zoomLevel + center.x,
            y: mapPos.y / zoomLevel - unscaledOffset.y / zoomLevel + center.y,
        };

        if (renderAsCompass) {
            const rotated = rotateAround(center, imgPosCorrected, -angle);
            ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
        } else {
            ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);
        }

        if (showText && catSettings.showLabel && typeSettings.showLabel) {
            drawMapLabel(ctx, marker, iconScale, center, imgPosCorrected, angle, renderAsCompass, icon.height);
        }
    }
}
