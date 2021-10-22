import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { positionUpdateRate } from '@/logic/hooks';
import MapIconsCache from '@/logic/mapIconsCache';
import { getTileCache } from '@/logic/tileCache';
import { getTileMarkerCache } from '@/logic/tileMarkerCache';
import { toMinimapCoordinate } from '@/logic/tiles';
import { getNearestTown } from '@/logic/townLocations';
import { getAngle, interpolateAngleCosine, interpolateAngleLinear, interpolateVectorsCosine, interpolateVectorsLinear, predictVector, squaredDistance } from '@/logic/util';
import drawMapFriends from './drawMapFriends';
import drawMapMarkers from './drawMapMarkers';
import drawMapPlayer from './drawMapPlayer';
import drawMapTiles from './drawMapTiles';

export type MapRendererParameters = {
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    offset: Vector2,

    playerPosition: Vector2,
    mapCenterPosition: Vector2,
    renderAsCompass: boolean,
    zoomLevel: number,
    angle: number,
}

export type MapIconRendererParameters = {
    settings: IconSettings | undefined,
    mapIconsCache: MapIconsCache,
    iconScale: number,
    showText: boolean,
}

const tileCache = getTileCache();
const markerCache = getTileMarkerCache();
export default function useMinimapRenderer(canvas: React.RefObject<HTMLCanvasElement>) {
    const appContext = useContext(AppContext);

    const [mapIconsCache] = useState(() => new MapIconsCache());

    const currentPlayerPosition = useRef<Vector2>(appContext.settings.lastKnownPosition);
    const lastPlayerPosition = useRef<Vector2>(currentPlayerPosition.current);
    const lastPositionUpdate = useRef<number>(performance.now());

    const lastAngle = useRef<number>(0);

    const mapPositionOverride = useRef<Vector2>();

    const currentFriends = useRef<FriendData[]>([]);

    // eslint-disable-next-line complexity
    const draw = (playerPos: Vector2, angle: number) => {
        const ctx = canvas.current?.getContext('2d');

        let zoomLevel = appContext.settings.zoomLevel;

        if (appContext.settings.townZoom) {
            const town = getNearestTown(playerPos);
            if (town.distance <= 10000) {
                zoomLevel = appContext.settings.townZoomLevel;
            }
        }

        const renderAsCompass = appContext.settings.compassMode && (appContext.isTransparentSurface ?? false);

        if (!ctx) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        const mapCenterPos = mapPositionOverride.current ?? playerPos;

        const offset = toMinimapCoordinate(
            mapCenterPos,
            mapCenterPos,
            ctx.canvas.width * zoomLevel,
            ctx.canvas.height * zoomLevel);

        const mapRendererParameters: MapRendererParameters = {
            angle,
            centerX,
            centerY,
            context: ctx,
            offset,
            playerPosition: playerPos,
            mapCenterPosition: mapCenterPos,
            renderAsCompass,
            zoomLevel,
        };

        const toDraw = drawMapTiles(mapRendererParameters);

        const iconSettings = appContext.settings.iconSettings;

        if (!iconSettings) {
            return;
        }

        const mapIconRendererParameters: MapIconRendererParameters = {
            iconScale: appContext.settings.iconScale,
            mapIconsCache,
            settings: iconSettings,
            showText: appContext.settings.showText,
        };

        drawMapMarkers(mapRendererParameters, mapIconRendererParameters, toDraw);

        drawMapFriends(mapRendererParameters, mapIconRendererParameters, currentFriends.current);

        drawMapPlayer(mapRendererParameters, mapIconRendererParameters);
    };

    function drawWithInterpolation(force: boolean) {
        const curTime = performance.now();
        const timeDif = curTime - lastPositionUpdate.current;
        const currentAngle = getAngle(lastPlayerPosition.current, currentPlayerPosition.current);

        if (timeDif > positionUpdateRate && !force) {
            return;
        }

        if (timeDif > positionUpdateRate
            || squaredDistance(lastPlayerPosition.current, currentPlayerPosition.current) > positionUpdateRate
            || appContext.settings.animationInterpolation === 'none') {
            draw(currentPlayerPosition.current, currentAngle);
            return;
        }

        const percentage = timeDif / positionUpdateRate;
        let interpolatedPosition = currentPlayerPosition.current;
        let interpolatedAngle = currentAngle;

        if (!appContext.settings.extrapolateLocation) {
            if (appContext.settings.animationInterpolation === 'linear') {
                interpolatedPosition = interpolateVectorsLinear(lastPlayerPosition.current, currentPlayerPosition.current, percentage);
                interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
            } else if (appContext.settings.animationInterpolation === 'cosine') {
                interpolatedPosition = interpolateVectorsCosine(lastPlayerPosition.current, currentPlayerPosition.current, percentage);
                interpolatedAngle = interpolateAngleCosine(lastAngle.current, currentAngle, percentage);
            }
        } else {
            const predictedPosition = predictVector(lastPlayerPosition.current, currentPlayerPosition.current);

            if (appContext.settings.animationInterpolation === 'linear') {
                interpolatedPosition = interpolateVectorsLinear(currentPlayerPosition.current, predictedPosition, percentage);
                interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
            } else if (appContext.settings.animationInterpolation === 'cosine') {
                interpolatedPosition = interpolateVectorsCosine(currentPlayerPosition.current, predictedPosition, percentage);
                interpolatedAngle = interpolateAngleCosine(lastAngle.current, currentAngle, percentage);
            }
        }

        draw(interpolatedPosition, interpolatedAngle);
    }

    // Store the `drawWithInterpolation` function in a ref object, so we can always access the latest one.
    const drawWithInterpolationRef = useRef(drawWithInterpolation);
    drawWithInterpolationRef.current = drawWithInterpolation;

    function redraw(force: boolean) {
        drawWithInterpolationRef.current(force);
    }

    function setPlayerPosition(pos: Vector2) {
        if (pos.x === currentPlayerPosition.current.x && pos.y === currentPlayerPosition.current.y) {
            return;
        }

        lastAngle.current = getAngle(lastPlayerPosition.current, currentPlayerPosition.current);
        lastPositionUpdate.current = performance.now();
        lastPlayerPosition.current = currentPlayerPosition.current;
        currentPlayerPosition.current = pos;

        redraw(true);
    }

    // This effect triggers a redraw when the context value changes (relevant for settings).
    useEffect(() => {
        redraw(true);
    }, [appContext]);

    // Recreate the icons when the icon scale changes
    useEffect(() => {
        mapIconsCache.initialize(appContext.settings.iconScale);
    }, [appContext.settings.iconScale]);

    // This effect listens for events from asset caches/stores.
    useEffect(() => {
        function handleTileDownloadingCountChange(count: number) {
            if (count === 0) {
                redraw(true);
            }
        }

        function handleAssetsLoaded() {
            redraw(true);
        }

        const tileRegistration = tileCache.registerOnTileDownloadingCountChange(handleTileDownloadingCountChange, window);
        const markerRegistration = markerCache.registerOnMarkersLoaded(handleAssetsLoaded, window);
        const mapIconsCacheRegistration = mapIconsCache.registerMapIconsLoaded(handleAssetsLoaded, window);
        return () => {
            tileRegistration();
            markerRegistration();
            mapIconsCacheRegistration();
        };
    }, []);

    return {
        currentFriends,
        currentPlayerPosition: currentPlayerPosition as { readonly current: Readonly<Vector2> },
        mapPositionOverride,
        redraw,
        setPlayerPosition,
    };
}
