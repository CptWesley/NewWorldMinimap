import { worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import drawMapLabel from '@/Minimap/drawMapLabels';
import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapMarkers(params: MapRendererParameters, iconParams: MapIconRendererParameters, markers: Marker[]) {
    const {
        context: ctx,
        center,
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

    for (const marker of markers) {
        const catSettings = iconSettings.categories[marker.category];
        if (!catSettings || !catSettings.visible) {
            continue;
        }

        const typeSettings = catSettings.types[marker.type];
        if (typeSettings && !typeSettings.visible) {
            continue;
        }

        const icon = mapIconsCache.getIcon(marker.type, marker.category);
        if (!icon) {
            continue;
        }
        const position = worldCoordinateToCanvas(
            marker.pos,
            mapCenterPos,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        if (renderAsCompass) {
            const rotated = rotateAround(center, position, -angle);
            ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
        } else {
            ctx.drawImage(icon, position.x - icon.width / 2, position.y - icon.height / 2);
        }

        if (showText && catSettings.showLabel && typeSettings?.showLabel) {
            drawMapLabel(ctx, marker, iconScale, center, position, angle, renderAsCompass, icon.height);
        }
    }
}
