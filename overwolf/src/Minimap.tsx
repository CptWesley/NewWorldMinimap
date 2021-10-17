import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { positionUpdateRate, registerEventCallback } from './logic/hooks';
import { getHotkeyManager } from './logic/hotkeyManager';
import { getIcon, GetPlayerIcon, setIconScale } from './logic/icons';
import { getMapTiles } from './logic/map';
import { getMarkers } from './logic/markers';
import { store, zoomLevelSettingBounds } from './logic/storage';
import { getTileCache } from './logic/tileCache';
import { getTileMarkerCache } from './logic/tileMarkerCache';
import { toMinimapCoordinate } from './logic/tiles';
import { getNearestTown } from './logic/townLocations';
import { getAngle, interpolateAngleCosine, interpolateAngleLinear, interpolateVectorsCosine, interpolateVectorsLinear, predictVector, rotateAround, squaredDistance } from './logic/util';
import { makeStyles } from './theme';

const debugLocations = {
    default: { x: 7728.177, y: 1988.299 } as Vector2,
    city: { x: 8912, y: 5783 } as Vector2,
};

interface IProps {
    className?: string;
}

const useStyles = makeStyles()({
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
});

const tileCache = getTileCache();
const markerCache = getTileMarkerCache();

const hotkeyManager = getHotkeyManager();
export default function Minimap(props: IProps) {
    const {
        className,
    } = props;
    const { classes } = useStyles();

    const currentPosition = useRef<Vector2>(debugLocations.default);
    const lastPosition = useRef<Vector2>(currentPosition.current);
    const lastPositionUpdate = useRef<number>(performance.now());
    const lastAngle = useRef<number>(0);

    const [tilesDownloading, setTilesDownloading] = useState(0);
    const canvas = useRef<HTMLCanvasElement>(null);

    const lastDraw = useRef(0);
    const appContext = useContext(AppContext);

    const interpolationEnabled = appContext.settings.interpolation !== 'none';

    const dynamicStyling: React.CSSProperties = {};
    if (appContext.isTransparentSurface) {
        dynamicStyling.clipPath = appContext.settings.shape;
    }

    const draw = async (pos: Vector2, angle: number) => {
        const ctx = canvas.current?.getContext('2d');
        const currentDraw = performance.now();
        lastDraw.current = currentDraw;

        let zoomLevel = appContext.settings.zoomLevel;

        if (appContext.settings.townZoom) {
            const town = getNearestTown(pos);
            if (town.distance <= 10000) {
                zoomLevel = appContext.settings.townZoomLevel;
            }
        }

        const renderAsCompass = appContext.settings.compassMode && (appContext.isTransparentSurface ?? false);

        setIconScale(appContext.settings.iconScale);

        if (!ctx) {
            return;
        }

        if (lastDraw.current !== currentDraw) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        const tiles = getMapTiles(pos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel, renderAsCompass ? -angle : 0);
        const offset = toMinimapCoordinate(pos, pos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);

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
                    ctx.translate(centerX, centerY);
                    ctx.rotate(-angle);
                    ctx.translate(-centerX, -centerY);
                    ctx.drawImage(bitmap,
                        bitmap.width / zoomLevel * x + centerX - offset.x / zoomLevel,
                        bitmap.height / zoomLevel * y + centerY - offset.y / zoomLevel,
                        bitmap.width / zoomLevel,
                        bitmap.height / zoomLevel
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(bitmap,
                        bitmap.width / zoomLevel * x + centerX - offset.x / zoomLevel,
                        bitmap.height / zoomLevel * y + centerY - offset.y / zoomLevel,
                        bitmap.width / zoomLevel,
                        bitmap.height / zoomLevel
                    );
                }

                toDraw = toDraw.concat(tile.markers);
            }
        }

        const iconSettings = appContext.settings.iconSettings;

        if (!iconSettings) {
            return;
        }

        for (const marker of toDraw) {
            const catSettings = iconSettings.categories[marker.category];
            if (!catSettings || !catSettings.value) {
                continue;
            }

            const typeSettings = catSettings.types[marker.type];
            if (typeSettings && !typeSettings.value) {
                continue;
            }

            const imgPos = toMinimapCoordinate(pos, marker.pos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
            const icon = await getIcon(marker.type, marker.category);
            const imgPosCorrected = { x: imgPos.x / zoomLevel - offset.x / zoomLevel + centerX, y: imgPos.y / zoomLevel - offset.y / zoomLevel + centerY };

            if (lastDraw.current !== currentDraw) {
                return;
            }

            if (renderAsCompass) {
                const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
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
                    const rotated = rotateAround({ x: centerX, y: centerY }, imgPosCorrected, -angle);
                    ctx.strokeText(marker.text, rotated.x, rotated.y + icon.height);
                    ctx.fillText(marker.text, rotated.x, rotated.y + icon.height);
                } else {
                    ctx.strokeText(marker.text, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                    ctx.fillText(marker.text, imgPosCorrected.x, imgPosCorrected.y + icon.height);
                }
            }
        }

        const playerIcon = await GetPlayerIcon();

        if (lastDraw.current !== currentDraw) {
            return;
        }

        if (renderAsCompass) {
            ctx.drawImage(playerIcon, centerX - playerIcon.width / 2, centerY - playerIcon.height / 2);
        } else {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.translate(-centerX, -centerY);
            ctx.drawImage(playerIcon, centerX - playerIcon.width / 2, centerY - playerIcon.height / 2);
            ctx.restore();
        }
    };

    function drawWithInterpolation(force: boolean) {
        const curTime = performance.now();
        const timeDif = curTime - lastPositionUpdate.current;
        const currentAngle = getAngle(lastPosition.current, currentPosition.current);

        if (timeDif > positionUpdateRate && !force) {
            return;
        }

        if (squaredDistance(lastPosition.current, currentPosition.current) > 1000 || appContext.settings.interpolation === 'none') {
            draw(currentPosition.current, currentAngle);
            return;
        }

        const percentage = timeDif / positionUpdateRate;
        let interpolatedPosition = currentPosition.current;
        let interpolatedAngle = currentAngle;

        if (appContext.settings.interpolation === 'linear-interpolation') {
            interpolatedPosition = interpolateVectorsLinear(lastPosition.current, currentPosition.current, percentage);
            interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
        } else if (appContext.settings.interpolation === 'cosine-interpolation') {
            interpolatedPosition = interpolateVectorsCosine(lastPosition.current, currentPosition.current, percentage);
            interpolatedAngle = interpolateAngleCosine(lastAngle.current, currentAngle, percentage);
        }

        const predictedPosition = predictVector(lastPosition.current, currentPosition.current);

        if (appContext.settings.interpolation === 'linear-extrapolation') {
            interpolatedPosition = interpolateVectorsLinear(currentPosition.current, predictedPosition, percentage);
            interpolatedAngle = interpolateAngleLinear(lastAngle.current, currentAngle, percentage);
        } else if (appContext.settings.interpolation === 'cosine-extrapolation') {
            interpolatedPosition = interpolateVectorsCosine(currentPosition.current, predictedPosition, percentage);
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
        if (pos.x === currentPosition.current.x && pos.y === currentPosition.current.y) {
            return;
        }

        lastAngle.current = getAngle(lastPosition.current, currentPosition.current);
        lastPositionUpdate.current = performance.now();
        lastPosition.current = currentPosition.current;
        currentPosition.current = pos;
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
        console.log(e.deltaY);
        zoomBy(Math.sign(e.deltaY) * appContext.settings.zoomLevel / 5 * Math.abs(e.deltaY) / 100);
    }

    // This effect triggers a redraw when the context value changes (relevant for settings).
    useEffect(() => {
        redraw(true);
    }, [appContext]);

    // This effect listens for events from asset caches/stores.
    useEffect(() => {
        function handleTileDownloadingCountChange(count: number) {
            setTilesDownloading(count);
            if (count === 0) {
                redraw(true);
            }
        }

        function handleMarkersLoaded() {
            redraw(true);
        }

        const tileRegistration = tileCache.registerOnTileDownloadingCountChange(handleTileDownloadingCountChange);
        const markerRegistration = markerCache.registerOnMarkersLoaded(handleMarkersLoaded);
        return () => {
            tileRegistration();
            markerRegistration();
        };
    }, []);

    if (NWMM_APP_WINDOW === 'inGame') {
        // This is alright, because the app window descriptor does not change.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const zoomInRegistration = hotkeyManager.registerHotkey('zoomIn', () => zoomBy(appContext.settings.zoomLevel / 5));
            const zoomOutRegistration = hotkeyManager.registerHotkey('zoomOut', () => zoomBy(appContext.settings.zoomLevel / -5));
            return () => { zoomInRegistration(); zoomOutRegistration(); };
        }, [appContext.settings.zoomLevel]);
    }

    // This effect starts a timer if interpolation is enabled.
    useEffect(() => {
        const interval = interpolationEnabled
            ? setInterval(() => redraw(false), 100)
            : undefined;

        return function () {
            clearInterval(interval);
        };
    }, [interpolationEnabled]);

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

        const callbackUnregister = registerEventCallback(info => {
            setPosition(info.position);
        });

        return function () {
            callbackUnregister();
        };
    }, []);

    return <div className={clsx(classes.minimap, className)}>
        <canvas
            ref={canvas}
            className={clsx(classes.canvas)}
            style={dynamicStyling}
            onWheel={handleWheel}
        />
        <div className={classes.cacheStatus}>
            {tilesDownloading > 0 &&
                <p>Loading {tilesDownloading} tiles</p>
            }
        </div>
    </div>;
}
