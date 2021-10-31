import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { FriendData } from '@/logic/friends';
import MapIconsCache from '@/logic/mapIconsCache';
import { store, zoomLevelSettingBounds } from '@/logic/storage';
import { getTileCache } from '@/logic/tileCache';
import { getTileMarkerCache } from '@/logic/tileMarkerCache';
import { getNearestTown } from '@/logic/townLocations';
import { getAngle, getAngleInterpolator, getNumberInterpolator, getVector2Interpolator, predictVector, squaredDistance, vector2Equal } from '@/logic/util';
import drawMapFriends from './drawMapFriends';
import drawMapMarkers from './drawMapMarkers';
import drawMapNavigation from './drawMapNavigation';
import drawMapNavigationTarget from './drawMapNavigationTarget';
import drawMapPlayer from './drawMapPlayer';
import drawMapTiles from './drawMapTiles';
import { angleInterpolationTime, locationInterpolationTime, mapFastZoom, mapSlowZoom, tooLargeDistance, townZoomDistance } from './mapConstants';
import { useInterpolation } from './useInterpolation';

export type MapRendererParameters = {
    context: CanvasRenderingContext2D,
    center: Vector2,
    playerPosition: Vector2,
    mapCenterPosition: Vector2,
    renderAsCompass: boolean,
    zoomLevel: number,
    angle: number,
}

export type MapIconRendererParameters = {
    settings: IconSettings,
    mapIconsCache: MapIconsCache,
    iconScale: number,
    showText: boolean,
}

export type LastDrawParameters = {
    mapRendererParams: Omit<MapRendererParameters, 'context'>,
    iconRendererParams: MapIconRendererParameters
};

const tileCache = getTileCache();
const markerCache = getTileMarkerCache();
export default function useMinimapRenderer(canvas: React.RefObject<HTMLCanvasElement>, hoverCanvas: React.RefObject<HTMLCanvasElement>) {
    const appContext = useContext(AppContext);

    const [mapIconsCache] = useState(() => new MapIconsCache());

    const currentPlayerPosition = useRef<Vector2>(appContext.settings.lastKnownPosition);
    const currentPlayerAngle = useRef<number>(0);
    const lastPlayerPosition = useRef<Vector2>(currentPlayerPosition.current);
    const lastPositionUpdate = useRef<number>(performance.now());
    const lastDrawParameters = useRef<LastDrawParameters>();

    const {
        get: getInterpolatedZoomLevel,
        update: updateInterpolatedZoomLevel,
        getCurrentValue: getCurrentZoomValue,
        isDone: zoomInterpolationDone,
    } = useInterpolation(getNumberInterpolator(appContext.settings.animationInterpolation), appContext.settings.zoomLevel, mapFastZoom);
    const {
        get: getInterpolatedAngle,
        update: updateInterpolatedAngle,
        isDone: angleInterpolationDone,
    } = useInterpolation(getAngleInterpolator(appContext.settings.animationInterpolation), currentPlayerAngle.current, angleInterpolationTime);
    const {
        get: getInterpolatedPlayerPosition,
        update: updateInterpolatedPlayerPosition,
        isDone: playerPositionInterpolationDone,
    } = useInterpolation(getVector2Interpolator(appContext.settings.animationInterpolation), currentPlayerPosition.current, locationInterpolationTime, vector2Equal);

    const usingTownZoom = useRef(false);

    const mapPositionOverride = useRef<Vector2>();

    const currentFriends = useRef<FriendData[]>([]);

    function automaticTownZoom(playerPosition: Vector2) {
        let nextZoomLevel = appContext.settings.zoomLevel;
        const wasUsingTownZoom = usingTownZoom.current;

        if (appContext.settings.townZoom && !mapPositionOverride.current) {
            const town = getNearestTown(playerPosition);
            if (town.distance <= townZoomDistance) {
                nextZoomLevel = appContext.settings.townZoomLevel;
                if (!usingTownZoom.current) {
                    usingTownZoom.current = true;
                }
            } else if (usingTownZoom.current) {
                usingTownZoom.current = false;
            }
        } else if (usingTownZoom.current) {
            usingTownZoom.current = false;
            nextZoomLevel = appContext.settings.zoomLevel;
        }

        if (nextZoomLevel !== getCurrentZoomValue()) {
            // Use slow zoom if the town zoom marker changed, the default otherwise
            updateInterpolatedZoomLevel(nextZoomLevel, wasUsingTownZoom !== usingTownZoom.current ? mapSlowZoom : undefined);
        }
    }

    const draw = () => {

        const ctx = canvas.current?.getContext('2d');
        const hoverCtx = hoverCanvas.current?.getContext('2d');
        if (!ctx || !hoverCtx) {
            return;
        }

        const playerPos = getInterpolatedPlayerPosition();
        automaticTownZoom(playerPos);

        const angle = getInterpolatedAngle();
        const zoomLevel = getInterpolatedZoomLevel();

        const renderAsCompass = appContext.settings.compassMode;

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;
        hoverCtx.canvas.width = hoverCtx.canvas.clientWidth;
        hoverCtx.canvas.height = hoverCtx.canvas.clientHeight;

        const center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
        };

        const mapCenterPos = mapPositionOverride.current ?? playerPos;

        const mapRendererParameters: MapRendererParameters = {
            angle,
            center,
            context: ctx,
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

        const navTarget = drawMapNavigation(mapRendererParameters);

        drawMapMarkers(mapRendererParameters, mapIconRendererParameters, toDraw);

        drawMapFriends(mapRendererParameters, mapIconRendererParameters, currentFriends.current);

        drawMapNavigationTarget(mapRendererParameters, mapIconRendererParameters, navTarget);

        drawMapPlayer(mapRendererParameters, mapIconRendererParameters);

        lastDrawParameters.current = {
            mapRendererParams: mapRendererParameters,
            iconRendererParams: mapIconRendererParameters,
        };
    };

    function drawWithInterpolation(force: boolean) {
        const interpolationsDone = zoomInterpolationDone() && angleInterpolationDone() && playerPositionInterpolationDone();

        if (interpolationsDone && !force) {
            return;
        }

        draw();
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

        currentPlayerAngle.current = getAngle(lastPlayerPosition.current, currentPlayerPosition.current);
        lastPositionUpdate.current = performance.now();
        lastPlayerPosition.current = currentPlayerPosition.current;
        currentPlayerPosition.current = pos;

        const bigPositionChange = squaredDistance(lastPlayerPosition.current, currentPlayerPosition.current) > tooLargeDistance;
        const updateTime = bigPositionChange ? 0 : undefined;

        if (!appContext.settings.extrapolateLocation) {
            updateInterpolatedPlayerPosition(currentPlayerPosition.current, updateTime);
        } else {
            const predictedPosition = predictVector(lastPlayerPosition.current, currentPlayerPosition.current);
            updateInterpolatedPlayerPosition(predictedPosition, updateTime);
        }
        updateInterpolatedAngle(getAngle(lastPlayerPosition.current, currentPlayerPosition.current), updateTime);

        redraw(true);
    }

    function getZoomLevel() {
        return usingTownZoom.current ? appContext.settings.townZoomLevel : appContext.settings.zoomLevel;
    }

    function zoomBy(delta: number) {
        const nextZoomLevel = Math.max(
            zoomLevelSettingBounds[0],
            Math.min(zoomLevelSettingBounds[1],
                getZoomLevel() + delta));
        const keyToUpdate = usingTownZoom.current ? 'townZoomLevel' : 'zoomLevel';
        appContext.update({ [keyToUpdate]: nextZoomLevel });
        store(keyToUpdate, nextZoomLevel);
    }

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

    const updateOn = [
        appContext.isTransparentSurface,
        appContext.settings.animationInterpolation,
        appContext.settings.compassMode,
        appContext.settings.extrapolateLocation,
        appContext.settings.iconScale,
        appContext.settings.iconSettings,
        appContext.settings.showText,
        appContext.settings.townZoom,
        appContext.settings.townZoomLevel,
        appContext.settings.zoomLevel,
    ];

    useEffect(() => {
        redraw(true);
    }, updateOn);

    return {
        currentFriends,
        currentPlayerPosition: currentPlayerPosition as { readonly current: Readonly<Vector2> },
        currentPlayerAngle: currentPlayerAngle as { readonly current: Readonly<number> },
        lastDrawParameters: lastDrawParameters as { readonly current: undefined | Readonly<LastDrawParameters> },
        getZoomLevel,
        mapPositionOverride,
        redraw,
        setPlayerPosition,
        zoomBy,
    };
}
