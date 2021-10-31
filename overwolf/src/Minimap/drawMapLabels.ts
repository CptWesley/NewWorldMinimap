import React from 'react';
import { getIconName } from '@/logic/icons';
import { getMarkers } from '@/logic/markers';
import { canvasCoordinateToWorld, getTileCoordinatesForWorldCoordinate, worldCoordinateToCanvas } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { LastDrawParameters } from '@/Minimap/useMinimapRenderer';
import setTextStyle from './setTextStyle';

export default function drawMapLabel(ctx: CanvasRenderingContext2D, marker: Marker, iconScale: number, center: Vector2, position: Vector2, angle: number, renderAsCompass: boolean, iconHeight: number) {
    setTextStyle(ctx, iconScale);

    const markerText = getIconName(marker.category, marker.name ?? marker.type);

    if (renderAsCompass) {
        const rotated = rotateAround({ x: center.x, y: center.y }, position, -angle);
        ctx.strokeText(markerText, rotated.x, rotated.y + iconHeight);
        ctx.fillText(markerText, rotated.x, rotated.y + iconHeight);
    } else {
        ctx.strokeText(markerText, position.x, position.y + iconHeight);
        ctx.fillText(markerText, position.x, position.y + iconHeight);
    }
}

export function drawMapHoverLabel(mousePos: Vector2, lastDrawCache: LastDrawParameters, canvas: React.RefObject<HTMLCanvasElement>, iconScale: number) {
    if (!canvas.current) {
        return;
    }

    const ctx = canvas.current.getContext('2d');
    if (!ctx) {
        return;
    }

    const {
        zoomLevel,
        center,
        mapCenterPosition,
        renderAsCompass,
        mapAngle,
    } = lastDrawCache.mapRendererParams;

    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;

    if (!lastDrawCache || !lastDrawCache.iconRendererParams || !lastDrawCache.mapRendererParams) {
        return;
    }

    const finalPos = renderAsCompass ? rotateAround(center, mousePos, mapAngle) : mousePos;
    const mouseInWorld = canvasCoordinateToWorld(finalPos, mapCenterPosition, zoomLevel, ctx.canvas.width, ctx.canvas.height);

    const tilePos = getTileCoordinatesForWorldCoordinate(mouseInWorld, 1);
    const markers = getMarkers(tilePos);

    if (!markers) {
        return;
    }

    // Iterate the list in reverse, so we always render the label for the top-most icon
    for (let i = markers.length - 1; i >= 0; --i) {
        const m = markers[i];

        const catSettings = lastDrawCache.iconRendererParams.settings.categories[m.category];
        if (!catSettings || !catSettings.visible) {
            continue;
        }

        const typeSettings = catSettings.types[m.type];
        if (typeSettings && !typeSettings.visible) {
            continue;
        }

        const icon = lastDrawCache.iconRendererParams.mapIconsCache.getIcon(m.type, m.category);
        if (!icon) {
            continue;
        }
        const position = worldCoordinateToCanvas(
            m.pos,
            mapCenterPosition,
            zoomLevel,
            ctx.canvas.width,
            ctx.canvas.height,
        );
        const pos = renderAsCompass ? rotateAround(center, position, -mapAngle) : position;
        if ((mousePos.x >= pos.x - icon.width / 2 && mousePos.y <= pos.y + icon.height / 2)
            && (mousePos.x <= pos.x + icon.width / 2 && mousePos.y >= pos.y - icon.height / 2)) {
            drawMapLabel(ctx, m, iconScale, center, position, mapAngle, renderAsCompass, icon.height);
            break;
        }
    }
}
