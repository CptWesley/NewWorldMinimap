import React from 'react';
import { getIconName } from '@/logic/icons';
import { getMarkers } from '@/logic/markers';
import { canvasToMinimapCoordinate, getTileCoordinatesForWorldCoordinate, toMinimapCoordinate } from '@/logic/tiles';
import { rotateAround } from '@/logic/util';
import { LastDrawParameters } from '@/Minimap/useMinimapRenderer';

export default function drawMapLabel(ctx: CanvasRenderingContext2D, marker: Marker, iconScale: number, center: Vector2, imgPosCorrected: Vector2, angle: number, renderAsCompass: boolean, iconHeight: number) {
    ctx.textAlign = 'center';
    ctx.font = Math.round(iconScale * 10) + 'px sans-serif';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2.5;

    const markerText = getIconName(marker.category, marker.name ?? marker.type);

    if (renderAsCompass) {
        const rotated = rotateAround({ x: center.x, y: center.y }, imgPosCorrected, -angle);
        ctx.strokeText(markerText, rotated.x, rotated.y + iconHeight);
        ctx.fillText(markerText, rotated.x, rotated.y + iconHeight);
    } else {
        ctx.strokeText(markerText, imgPosCorrected.x, imgPosCorrected.y + iconHeight);
        ctx.fillText(markerText, imgPosCorrected.x, imgPosCorrected.y + iconHeight);
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
        unscaledOffset: offset,
        center,
        mapCenterPosition,
        renderAsCompass,
        angle,
    } = lastDrawCache.mapRendererParams;

    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;

    if (!lastDrawCache || !lastDrawCache.iconRendererParams || !lastDrawCache.mapRendererParams) {
        return;
    }

    const finalPos = renderAsCompass ? rotateAround(center, mousePos, angle) : mousePos;
    const mouseInWorld = canvasToMinimapCoordinate(finalPos, mapCenterPosition, zoomLevel, ctx.canvas.width, ctx.canvas.height);

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

        const mapPos = toMinimapCoordinate(
            mapCenterPosition,
            m.pos,
            ctx.canvas.width,
            ctx.canvas.height,
            zoomLevel,
            1);
        const icon = lastDrawCache.iconRendererParams.mapIconsCache.getIcon(m.type, m.category);
        if (!icon) {
            continue;
        }
        const imgPosCorrected = {
            x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
            y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
        };
        const pos = renderAsCompass ? rotateAround(center, imgPosCorrected, -angle) : imgPosCorrected;
        if ((mousePos.x >= pos.x - icon.width / 2 && mousePos.y <= pos.y + icon.height / 2)
            && (mousePos.x <= pos.x + icon.width / 2 && mousePos.y >= pos.y - icon.height / 2)) {
            drawMapLabel(ctx, m, iconScale, center, imgPosCorrected, angle, renderAsCompass, icon.height);
            break;
        }
    }
}
