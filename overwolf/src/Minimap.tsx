import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { keyframes } from 'tss-react';
import RecenterIcon from '@/Icons/RecenterIcon';
import MinimapToolbar from '@/MinimapToolbar';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import ZoomInIcon from './Icons/ZoomInIcon';
import ZoomOutIcon from './Icons/ZoomOutIcon';
import { getFriendCode, updateFriendLocation } from './logic/friends';
import { positionUpdateRate, registerEventCallback } from './logic/hooks';
import { getHotkeyManager } from './logic/hotkeyManager';
import { getIconName } from './logic/icons';
import {getMapTile, getMapTiles} from './logic/map';
import MapIconsCache from './logic/mapIconsCache';
import { getMarkers } from './logic/markers';
import { store, zoomLevelSettingBounds } from './logic/storage';
import { getTileCache } from './logic/tileCache';
import { getTileMarkerCache } from './logic/tileMarkerCache';
import {canvasToMinimapCoordinate, toMinimapCoordinate} from './logic/tiles';
import { getNearestTown } from './logic/townLocations';
import { getAngle, interpolateAngleCosine, interpolateAngleLinear, interpolateVectorsCosine, interpolateVectorsLinear, predictVector, rotateAround, squaredDistance } from './logic/util';
import MinimapToolbarIconButton from './MinimapToolbarIconButton';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const showRecenterButton = keyframes({
    from: {
        width: 0,
        padding: 0,
    },
    to: {
        width: 40,
        padding: 5,
    },
});

const useStyles = makeStyles()(theme => ({
    minimap: {
        position: 'relative',
    },
    cacheStatus: {
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#ffffff',
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: globalLayers.minimapCacheStatus,
    },
    canvas: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.minimapCanvas,
    },
    passthroughCanvas: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        pointerEvents: 'none',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.minimapCanvas,
    },
    mapControls: {
        position: 'absolute',
        right: theme.spacing(1),
        bottom: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    recenter: {
        animation: `300ms ease ${showRecenterButton}`,
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            width: '100%',
        },
    },
}));

const tileCache = getTileCache();
const markerCache = getTileMarkerCache();

const hotkeyManager = getHotkeyManager();
export default function Minimap(props: IProps) {
    const {
        className,
    } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    const appContext = useContext(AppContext);

    const mapPositionOverride = useRef<Vector2>();
    const currentPlayerPosition = useRef<Vector2>(appContext.settings.lastKnownPosition);
    const currentFriends = useRef<FriendData[]>([]);
    const lastPlayerPosition = useRef<Vector2>(currentPlayerPosition.current);
    const lastPositionUpdate = useRef<number>(performance.now());
    const lastAngle = useRef<number>(0);
    const playerName = useRef<string>('UnknownFriend');

    const [tilesDownloading, setTilesDownloading] = useState(0);
    const [mapIconsCache] = useState(() => new MapIconsCache());
    const [isMapDragged, setIsMapDragged] = useState(false);
    const canvas = useRef<HTMLCanvasElement>(null);
    const hoverCanvas = useRef<HTMLCanvasElement>(null);

    const lastDraw = useRef(0);

    const scrollingMap = useRef<{ pointerId: number, position: Vector2, threshold: boolean }>();

    const interpolationEnabled = appContext.settings.interpolation !== 'none';

    const dynamicStyling: React.CSSProperties = {};

    const hoverThreshold = 25;

    if (appContext.isTransparentSurface) {
        dynamicStyling.clipPath = appContext.settings.shape;
    }

    // eslint-disable-next-line complexity
    const draw = (playerPos: Vector2, angle: number) => {
        const ctx = canvas.current?.getContext('2d');
        const labelCtx = hoverCanvas.current?.getContext('2d');
        const currentDraw = performance.now();
        lastDraw.current = currentDraw;

        let zoomLevel = appContext.settings.zoomLevel;

        if (appContext.settings.townZoom) {
            const town = getNearestTown(playerPos);
            if (town.distance <= 10000) {
                zoomLevel = appContext.settings.townZoomLevel;
            }
        }

        let renderAsCompass = appContext.settings.compassMode && (appContext.isTransparentSurface ?? false);

        if (!ctx || !labelCtx) {
            return;
        }

        if (lastDraw.current !== currentDraw) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;
        labelCtx.canvas.width = ctx.canvas.clientWidth;
        labelCtx.canvas.height = ctx.canvas.clientHeight;

        const center = {x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };

        const mapCenterPos = mapPositionOverride.current ?? playerPos;
        const tiles = getMapTiles(mapCenterPos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel, renderAsCompass ? -angle : 0);
        const offset = toMinimapCoordinate(mapCenterPos, mapCenterPos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);

        let toDraw: Marker[] = [];

        for (let x = 0; x < tiles.length; x++) {
            const row = tiles[x];
            for (let y = 0; y < row.length; y++) {
                const tile = row[y];
                const bitmap = tile.image;

                if (lastDraw.current !== currentDraw) {
                    return;
                }

                if (!bitmap) {
                    continue;
                }

                if (renderAsCompass) {
                    ctx.save();
                    ctx.translate(center.x, center.y);
                    ctx.rotate(-angle);
                    ctx.translate(-center.x, -center.y);
                    ctx.drawImage(bitmap,
                        bitmap.width / zoomLevel * x + center.x - offset.x / zoomLevel,
                        bitmap.height / zoomLevel * y + center.y - offset.y / zoomLevel,
                        bitmap.width / zoomLevel,
                        bitmap.height / zoomLevel
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(bitmap,
                        bitmap.width / zoomLevel * x + center.x - offset.x / zoomLevel,
                        bitmap.height / zoomLevel * y + center.y - offset.y / zoomLevel,
                        bitmap.width / zoomLevel,
                        bitmap.height / zoomLevel
                    );
                }

                toDraw = toDraw.concat(tile.markers);
            }
        }

        ctx.canvas.addEventListener('mousemove',e => {
            onCanvasMouseMove({x: e.pageX, y: e.pageY}, playerPos, {x: center.x, y: center.y}, angle, renderAsCompass, mapCenterPos, labelCtx, zoomLevel, offset);
        });

        const iconSettings = appContext.settings.iconSettings;

        if (!iconSettings) {
            return;
        }

        for (const marker of toDraw) {
            const catSettings = iconSettings.categories[marker.category];
            if (!catSettings || !catSettings.visible) {
                continue;
            }

            const typeSettings = catSettings.types[marker.type];
            if (typeSettings && !typeSettings.visible) {
                continue;
            }

            const mapPos = toMinimapCoordinate(
                renderAsCompass ? playerPos : mapCenterPos,
                marker.pos,
                ctx.canvas.width * zoomLevel,
                ctx.canvas.height * zoomLevel);
            const icon = mapIconsCache.getIcon(marker.type, marker.category);
            if (!icon) { continue; }
            const imgPosCorrected = {
                x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
            };

            if (lastDraw.current !== currentDraw) {
                return;
            }

            if (renderAsCompass) {
                const rotated = rotateAround({ x: center.x, y: center.y }, imgPosCorrected, -angle);
                ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
            } else {
                ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);
            }

            if (appContext.settings.showText && catSettings.showLabel && typeSettings.showLabel) {
                drawMarkerText(ctx, {x: center.x, y: center.y}, imgPosCorrected, angle, icon.height, marker, renderAsCompass);
            }
        }

        for (const key in currentFriends.current) {
            const imgPos = toMinimapCoordinate(mapCenterPos, { x: currentFriends.current[key].location.x, y: currentFriends.current[key].location.y } as Vector2, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
            const icon = mapIconsCache.getFriendIcon();
            if (!icon) { continue; }
            const imgPosCorrected = {
                x: imgPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                y: imgPos.y / zoomLevel - offset.y / zoomLevel + center.y,
            };

            if (lastDraw.current !== currentDraw) {
                return;
            }

            if (renderAsCompass) {
                const rotated = rotateAround({ x: center.x, y: center.y }, imgPosCorrected, -angle);
                ctx.drawImage(icon, rotated.x - icon.width / 2, rotated.y - icon.height / 2);
            } else {
                ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);
            }

            if (appContext.settings.showText) {
                ctx.textAlign = 'center';
                ctx.font = Math.round(icon.height / 1.5) + 'px sans-serif';
                ctx.strokeStyle = '#000';
                ctx.fillStyle = '#fff';

                if (renderAsCompass) {
                    const rotated = rotateAround({ x: center.x, y: center.y }, imgPosCorrected, -angle);
                    ctx.strokeText(currentFriends.current[key].name, rotated.x, rotated.y + icon.height);
                    ctx.fillText(currentFriends.current[key].name, rotated.x, rotated.y + icon.height);
                } else {
                    ctx.strokeText(currentFriends.current[key].name, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                    ctx.fillText(currentFriends.current[key].name, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                }
            }
        }

        const playerIcon = mapIconsCache.getPlayerIcon();

        if (lastDraw.current !== currentDraw) {
            return;
        }

        if (playerIcon) {
            if (renderAsCompass) {
                ctx.drawImage(playerIcon, center.x - playerIcon.width / 2, center.y - playerIcon.height / 2);
            } else {
                const mapPos = toMinimapCoordinate(mapCenterPos, playerPos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
                const imgPosCorrected = {
                    x: mapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                    y: mapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
                };
                ctx.save();
                ctx.translate(imgPosCorrected.x, imgPosCorrected.y);
                ctx.rotate(angle);
                ctx.translate(-imgPosCorrected.x, -imgPosCorrected.y);
                ctx.drawImage(playerIcon, imgPosCorrected.x - playerIcon.width / 2, imgPosCorrected.y - playerIcon.height / 2);
                ctx.restore();
            }
        }
    };

    function onCanvasMouseMove(mousePos: Vector2, playerPos: Vector2, center: Vector2, angle: number, renderAsCompass: boolean, mapCenterPos: Vector2, labelCtx: CanvasRenderingContext2D, zoomLevel: number, offset: Vector2) {
        try {
            const rotated = rotateAround({ x: center.x, y: center.y }, mousePos, angle);
            const finalPos = renderAsCompass ? rotated : mousePos;
            const hoverPos = canvasToMinimapCoordinate(finalPos, mapCenterPos, zoomLevel, labelCtx.canvas.width, labelCtx.canvas.height);

            const mapTile = getMapTile(hoverPos);
            labelCtx.clearRect(0, 0, labelCtx.canvas.width, labelCtx.canvas.height);
            const iconSettings = appContext.settings.iconSettings;

            if (!iconSettings) {
                return;
            }

            mapTile.markers.forEach(m => {
                const catSettings = iconSettings.categories[m.category];
                const typeSettings = catSettings.types[m.type];

                if (!catSettings || !catSettings.visible || (typeSettings && !typeSettings.visible)) {
                    return;
                }

                if (squaredDistance(hoverPos, m.pos) < hoverThreshold*zoomLevel) {
                    const markerMapPos = toMinimapCoordinate(
                        renderAsCompass ? playerPos : mapCenterPos,
                        m.pos,
                        labelCtx.canvas.width * zoomLevel,
                        labelCtx.canvas.height * zoomLevel);
                    const icon = mapIconsCache.getIcon(m.type, m.category);
                    if (icon) {
                        const imgPosCorrected = {
                            x: markerMapPos.x / zoomLevel - offset.x / zoomLevel + center.x,
                            y: markerMapPos.y / zoomLevel - offset.y / zoomLevel + center.y,
                        };
                        drawMarkerText(labelCtx, {
                            x: center.x,
                            y: center.y,
                        }, imgPosCorrected, angle, icon.height, m, renderAsCompass);
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    function drawMarkerText(ctx: CanvasRenderingContext2D, centerPos: Vector2, imgPos: Vector2, angle: number, iconHeight: number, marker: Marker, renderAsCompass: boolean) {
        ctx.textAlign = 'center';
        ctx.font = Math.round(appContext.settings.iconScale * 10) + 'px sans-serif';
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';

        const markerText = getIconName(marker.category, marker.name ?? marker.type);

        if (renderAsCompass) {
            const rotated = rotateAround({ x: centerPos.x, y: centerPos.y }, imgPos, -angle);
            ctx.strokeText(markerText, rotated.x, rotated.y + iconHeight);
            ctx.fillText(markerText, rotated.x, rotated.y + iconHeight);
        } else {
            ctx.strokeText(markerText, imgPos.x, imgPos.y + iconHeight);
            ctx.fillText(markerText, imgPos.x, imgPos.y + iconHeight);
        }

    }

    function drawWithInterpolation(force: boolean) {
        const curTime = performance.now();
        const timeDif = curTime - lastPositionUpdate.current;
        const currentAngle = getAngle(lastPlayerPosition.current, currentPlayerPosition.current);

        if (timeDif > positionUpdateRate && !force) {
            return;
        }

        if (timeDif > positionUpdateRate
            || squaredDistance(lastPlayerPosition.current, currentPlayerPosition.current) > positionUpdateRate
            || appContext.settings.interpolation === 'none') {
            draw(currentPlayerPosition.current, currentAngle);
            return;
        }

        const percentage = timeDif / positionUpdateRate;
        let interpolatedPosition = currentPlayerPosition.current;
        let interpolatedAngle = currentAngle;

        if (appContext.settings.interpolation === 'linear-interpolation') {
            interpolatedPosition = interpolateVectorsLinear(lastPlayerPosition.current, currentPlayerPosition.current, percentage);
            interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
        } else if (appContext.settings.interpolation === 'cosine-interpolation') {
            interpolatedPosition = interpolateVectorsCosine(lastPlayerPosition.current, currentPlayerPosition.current, percentage);
            interpolatedAngle = interpolateAngleCosine(lastAngle.current, currentAngle, percentage);
        }

        const predictedPosition = predictVector(lastPlayerPosition.current, currentPlayerPosition.current);

        if (appContext.settings.interpolation === 'linear-extrapolation') {
            interpolatedPosition = interpolateVectorsLinear(currentPlayerPosition.current, predictedPosition, percentage);
            interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
        } else if (appContext.settings.interpolation === 'cosine-extrapolation') {
            interpolatedPosition = interpolateVectorsCosine(currentPlayerPosition.current, predictedPosition, percentage);
            interpolatedAngle = interpolateAngleCosine(lastAngle.current, currentAngle, percentage);
        }

        draw(interpolatedPosition, interpolatedAngle);
    }

    // Store the `drawWithInterpolation` function in a ref object, so we can always access the latest one.
    const drawWithInterpolationRef = useRef(drawWithInterpolation);
    drawWithInterpolationRef.current = drawWithInterpolation;

    function redraw(force: boolean) {
        drawWithInterpolationRef.current(force);
    }

    function setPosition(pos: Vector2) {
        if (appContext.settings.shareLocation) {
            const sharedLocation = updateFriendLocation(appContext.settings.friendServerUrl, getFriendCode(), playerName.current, pos, appContext.settings.friends);
            sharedLocation.then(r => {
                if (r !== undefined) {
                    setFriends(r.friends);
                } else {
                    setFriends([]);
                }
            });
        }

        if (pos.x === currentPlayerPosition.current.x && pos.y === currentPlayerPosition.current.y) {
            return;
        }

        lastAngle.current = getAngle(lastPlayerPosition.current, currentPlayerPosition.current);
        lastPositionUpdate.current = performance.now();
        lastPlayerPosition.current = currentPlayerPosition.current;
        currentPlayerPosition.current = pos;

        store('lastKnownPosition', pos);
        redraw(true);
    }

    function setFriends(friends: FriendData[]) {
        if (friends.length === currentFriends.current.length) {
            for (const key in friends) {
                if (friends[key].name === currentFriends.current[key].name
                    && friends[key].location.x === currentFriends.current[key].location.x
                    && friends[key].location.y === currentFriends.current[key].location.y) {
                    return;
                }
            }
        }

        currentFriends.current = friends;
        redraw(true);
    }

    function zoomBy(delta: number) {
        const nextZoomLevel = Math.max(
            zoomLevelSettingBounds[0],
            Math.min(
                zoomLevelSettingBounds[1],
                appContext.settings.zoomLevel + delta));
        appContext.update({ zoomLevel: nextZoomLevel });
        store('zoomLevel', nextZoomLevel);
    }

    function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
        zoomBy(Math.sign(e.deltaY) * appContext.settings.zoomLevel / 5 * Math.abs(e.deltaY) / 100);
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        if (NWMM_APP_WINDOW !== 'desktop') { return; }
        // Left mouse button only
        if (e.pointerType === 'mouse' && e.button !== 0) { return; }
        scrollingMap.current = {
            pointerId: e.pointerId,
            position: { x: e.pageX, y: e.pageY },
            threshold: false,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function onRecenterMap() {
        mapPositionOverride.current = undefined;
        setIsMapDragged(false);
        redraw(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            const dX = e.pageX - scrollingMap.current.position.x;
            const dY = e.pageY - scrollingMap.current.position.y;
            const dragAllowed = scrollingMap.current.threshold || Math.abs(dX) > 3 || Math.abs(dY) > 3;
            if (dragAllowed) {
                if (!scrollingMap.current.threshold) {
                    scrollingMap.current.threshold = true;
                    mapPositionOverride.current = { ...mapPositionOverride.current ?? currentPlayerPosition.current };
                    setIsMapDragged(true);
                } else if (mapPositionOverride.current) {
                    mapPositionOverride.current.x -= dX * appContext.settings.zoomLevel / 4;
                    mapPositionOverride.current.y += dY * appContext.settings.zoomLevel / 4;
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
        }
    }

    // This effect triggers a redraw when the context value changes (relevant for settings).
    useEffect(() => {
        redraw(true);
    }, [appContext]);

    // This effect listens for events from asset caches/stores.
    useEffect(() => {
        mapIconsCache.initialize(appContext.settings.iconScale);
    }, [appContext.settings.iconScale]);

    useEffect(() => {
        mapIconsCache.initialize(appContext.settings.iconScale);
    }, [appContext.settings.iconScale]);

    useEffect(() => {
        function handleTileDownloadingCountChange(count: number) {
            setTilesDownloading(count);
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

    if (NWMM_APP_WINDOW === 'inGame') {
        // This is alright, because the app window descriptor does not change.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const zoomInRegistration = hotkeyManager.registerHotkey('zoomIn', () => zoomBy(appContext.settings.zoomLevel / 5), window);
            const zoomOutRegistration = hotkeyManager.registerHotkey('zoomOut', () => zoomBy(appContext.settings.zoomLevel / -5), window);
            return () => { zoomInRegistration(); zoomOutRegistration(); };
        }, [appContext.settings.zoomLevel]);
    }

    // This effect starts a timer if interpolation is enabled.
    useEffect(() => {
        const interval = interpolationEnabled
            ? setInterval(() => redraw(false), positionUpdateRate / appContext.settings.resamplingRate)
            : undefined;

        return function () {
            if (interval) {
                clearInterval(interval);
            }
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
            ref={hoverCanvas}
            className={clsx(classes.passthroughCanvas)}
            style={dynamicStyling}
        />
        <div className={classes.cacheStatus}>
            {tilesDownloading > 0 &&
                <p>{t('minimap.tilesLoading', { count: tilesDownloading })}</p>
            }
        </div>
        {NWMM_APP_WINDOW === 'desktop' &&
            <MinimapToolbar className={classes.mapControls}>
                <MinimapToolbarIconButton onClick={() => zoomBy(appContext.settings.zoomLevel / -5)} title={t('minimap.zoomIn')}>
                    <ZoomInIcon />
                </MinimapToolbarIconButton>
                <MinimapToolbarIconButton onClick={() => zoomBy(appContext.settings.zoomLevel / 5)} title={t('minimap.zoomOut')}>
                    <ZoomOutIcon />
                </MinimapToolbarIconButton>
                {isMapDragged && <MinimapToolbarIconButton className={classes.recenter} onClick={onRecenterMap} title={t('minimap.recenter')}>
                    <RecenterIcon />
                </MinimapToolbarIconButton>}
            </MinimapToolbar>
        }
    </div>;
}
