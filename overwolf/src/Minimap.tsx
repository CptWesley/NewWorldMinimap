import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSObject } from 'tss-react';
import { drawMapHoverLabel } from '@/Minimap/drawMapLabels';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { FriendData, updateFriendLocation } from './logic/friends';
import { positionUpdateRate, registerEventCallback } from './logic/hooks';
import { getHotkeyManager } from './logic/hotkeyManager';
import { getMarkers } from './logic/markers';
import { getNavTarget, resetNav, setNav } from './logic/navigation/navigation';
import { store } from './logic/storage';
import { getTileCache } from './logic/tileCache';
import { canvasCoordinateToWorld } from './logic/tiles';
import { getNearestTown } from './logic/townLocations';
import { rotateAround, squaredDistance } from './logic/util';
import { townZoomDistance } from './Minimap/mapConstants';
import MinimapUpdateNotification from './Minimap/MinimapUpdateNotification';
import useMinimapRenderer from './Minimap/useMinimapRenderer';
import MinimapToolbars, { MinimapInteractionMode } from './MinimapToolbars';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const useStyles = makeStyles()(() => {
    const canvasStyling: CSSObject = {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };
    return {
        minimap: {
            position: 'relative',
        },
        statuses: {
            position: 'absolute',
            left: 0,
            bottom: 0,
            zIndex: globalLayers.minimapStatuses,

            '& > *': {
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
            },
        },
        canvas: {
            ...canvasStyling,
            zIndex: globalLayers.minimapCanvas,
        },
        hoverCanvas: {
            ...canvasStyling,
            zIndex: globalLayers.minimapHoverCanvas,
            pointerEvents: 'none',
        },
    };
});

const tileCache = getTileCache();

const hotkeyManager = getHotkeyManager();
export default function Minimap(props: IProps) {
    const {
        className,
    } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    const appContext = useContext(AppContext);

    const playerName = useRef<string>('UnknownFriend');

    const [tilesDownloading, setTilesDownloading] = useState(0);
    const [isMapDragging, setIsMapDragging] = useState(false);
    const [isMapDragged, setIsMapDragged] = useState(false);
    const [interactionMode, setInteractionMode] = useState<MinimapInteractionMode>('drag');
    const canvas = useRef<HTMLCanvasElement>(null);
    const hoverLabelCanvas = useRef<HTMLCanvasElement>(null);

    const scrollingMap = useRef<{ pointerId: number, position: Vector2, threshold: boolean }>();

    const interpolationEnabled = appContext.settings.animationInterpolation !== 'none';

    const dynamicStyling: React.CSSProperties = {};

    if (appContext.isTransparentSurface) {
        dynamicStyling.clipPath = appContext.settings.shape;
    }

    const {
        currentFriends,
        currentPlayerPosition,
        currentPlayerAngle,
        lastDrawParameters,
        getZoomLevel,
        mapOverride,
        redraw,
        setPlayerPosition,
        zoomBy,
    } = useMinimapRenderer(canvas, hoverLabelCanvas);

    function setPosition(pos: Vector2) {
        if (appContext.settings.shareLocation) {
            const sharedLocation = updateFriendLocation(appContext.settings.channelsServerUrl, playerName.current, pos);
            sharedLocation.then(setFriends);
        }

        store('lastKnownPosition', pos);
        setPlayerPosition(pos);
    }

    function setFriends(channels: undefined | FriendData[]) {
        currentFriends.current = channels ?? [];
        redraw(true);
    }

    function setNavigation(canvasPos: Vector2) {
        if (!canvas.current) { return; }
        const centerPos = lastDrawParameters.current?.mapRendererParams.mapCenterPosition;
        if (!centerPos) { return; }
        const width = canvas.current.width;
        const height = canvas.current.height;

        const town = getNearestTown(centerPos);
        const zoomLevel = town.distance <= townZoomDistance ? appContext.settings.townZoomLevel : appContext.settings.zoomLevel;

        let worldPos = canvasCoordinateToWorld(canvasPos, centerPos, zoomLevel, width, height);
        if (appContext.settings.compassMode && (appContext.isTransparentSurface ?? false)) {
            worldPos = rotateAround(centerPos, worldPos, -currentPlayerAngle.current);
        }
        const currentTarget = getNavTarget();

        if (currentTarget && squaredDistance(worldPos, currentTarget) < 200) {
            resetNav();
        } else {
            setNav(currentPlayerPosition.current, worldPos);
        }

        redraw(true);
    }

    function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
        zoomBy(getZoomLevel() / 5 * e.deltaY / 100);
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        if ((interactionMode === 'drag' && e.button === 0) || (interactionMode !== 'drag' && e.button === 1)) {
            scrollingMap.current = {
                pointerId: e.pointerId,
                position: { x: e.pageX, y: e.pageY },
                threshold: false,
            };
            setIsMapDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
        } else if ((interactionMode === 'destination' && e.button === 0) || (interactionMode === 'drag' && e.button === 1)) {
            setNavigation({ x: e.pageX, y: e.pageY });
        }
    }

    function onRecenterMap() {
        mapOverride.current = undefined;
        redraw(true);
        setIsMapDragged(false);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (!hoverLabelCanvas) {
            return;
        }

        if (hoverLabelCanvas && lastDrawParameters.current && !appContext.settings.showText) {
            const mousePos = { x: e.pageX, y: e.pageY };
            drawMapHoverLabel(mousePos, lastDrawParameters.current, hoverLabelCanvas, appContext.settings.iconScale);
        }

        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            const dX = e.pageX - scrollingMap.current.position.x;
            const dY = e.pageY - scrollingMap.current.position.y;
            const dragAllowed = scrollingMap.current.threshold || Math.abs(dX) > 3 || Math.abs(dY) > 3;
            if (dragAllowed) {
                if (!scrollingMap.current.threshold) {
                    scrollingMap.current.threshold = true;
                    if (!mapOverride.current) {
                        mapOverride.current = { ...currentPlayerPosition.current, angle: lastDrawParameters.current?.mapRendererParams.mapAngle ?? 0 };
                    }
                    setIsMapDragged(true);
                } else if (mapOverride.current) {
                    const angle = lastDrawParameters.current?.mapRendererParams.renderAsCompass && lastDrawParameters.current.mapRendererParams.mapAngle;
                    const rotatedDX = angle ? dX * Math.cos(angle) - dY * Math.sin(angle) : dX;
                    const rotatedDY = angle ? dY * Math.cos(angle) + dX * Math.sin(angle) : dY;
                    mapOverride.current.x -= rotatedDX * getZoomLevel() / 4;
                    mapOverride.current.y += rotatedDY * getZoomLevel() / 4;
                }
                redraw(true);
                scrollingMap.current.position.x = e.pageX;
                scrollingMap.current.position.y = e.pageY;
            }
        }
    }

    function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            scrollingMap.current = undefined;
            setIsMapDragging(false);
        }
    }

    useEffect(() => tileCache.registerOnTileDownloadingCountChange(setTilesDownloading, window), []);

    if (NWMM_APP_WINDOW === 'inGame') {
        // This is alright, because the app window descriptor does not change.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const zoomInRegistration = hotkeyManager.registerHotkey('zoomIn', () => zoomBy(getZoomLevel() / 5), window);
            const zoomOutRegistration = hotkeyManager.registerHotkey('zoomOut', () => zoomBy(getZoomLevel() / -5), window);
            return () => {
                zoomInRegistration();
                zoomOutRegistration();
            };
        }, [getZoomLevel()]);
    }

    // This effect starts a timer if interpolation is enabled.
    useEffect(() => {
        let allowed = true;
        const minFrameTime = positionUpdateRate / appContext.settings.resamplingRate;
        let lastTimestamp = performance.now();

        function animationFrame(time: DOMHighResTimeStamp) {
            if (time - lastTimestamp >= minFrameTime) {
                lastTimestamp = time;
                redraw(false);
            }
            start();
        }

        function start() {
            if (allowed) {
                requestAnimationFrame(animationFrame);
            }
        }

        start();

        return function () {
            allowed = false;
        };
    }, [interpolationEnabled, appContext.settings.resamplingRate]);

    // This effect adds an event handler for the window resize event, triggering a redraw when it fires.
    useEffect(() => {
        const onResize = () => redraw(true);
        window.addEventListener('resize', onResize);

        return function () {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // This effect adds a registration for position updates.
    useEffect(() => {
        // Expose the setPosition and getMarkers window on the global Window object
        (window as any).setPosition = setPosition;
        (window as any).getMarkers = getMarkers;
        (window as any).setFriends = setFriends;

        const callbackUnregister = registerEventCallback(info => {
            setPosition(info.position);

            if (info.name) {
                playerName.current = info.name;
            }
        }, window);

        return function () {
            callbackUnregister();
        };
    }, [appContext.settings]);

    if (isMapDragging) {
        dynamicStyling.cursor = 'move';
    } else if (interactionMode === 'destination') {
        dynamicStyling.cursor = 'crosshair';
    }

    return <div className={clsx(classes.minimap, className)}>
        <canvas
            ref={canvas}
            className={clsx(classes.canvas)}
            style={dynamicStyling}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        />
        <canvas
            ref={hoverLabelCanvas}
            className={clsx(classes.hoverCanvas)}
            style={dynamicStyling}
        />
        <MinimapToolbars
            getZoomLevel={getZoomLevel}
            interactionMode={interactionMode}
            isMapDragged={isMapDragged}
            onRecenterMap={onRecenterMap}
            setInteractionMode={setInteractionMode}
            zoomBy={zoomBy}
        />
        <div className={classes.statuses}>
            {tilesDownloading > 0 && <p>{t('minimap.tilesLoading', { count: tilesDownloading })}</p>}
            <MinimapUpdateNotification />
        </div>
    </div>;
}
