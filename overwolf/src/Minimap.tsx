import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { registerEventCallback } from './logic/hooks';
import { getIcon, GetPlayerIcon, setIconScale } from './logic/icons';
import { getMapTiles } from './logic/map';
import { getMarkers } from './logic/markers';
import { getTileCache } from './logic/tileCache';
import { getTileMarkerCache } from './logic/tileMarkerCache';
import { toMinimapCoordinate } from './logic/tiles';
import { rotateAround } from './logic/util';
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

export default function Minimap(props: IProps) {
    const {
        className,
    } = props;
    const { classes } = useStyles();

    const [currentPosition, setCurrentPosition] = useState<Vector2>(debugLocations.default);
    const [lastPosition, setLastPosition] = useState<Vector2>(currentPosition);
    const [tilesDownloading, setTilesDownloading] = useState(0);
    const canvas = useRef<HTMLCanvasElement>(null);

    const lastDraw = useRef(0);
    const appContext = useContext(AppContext);

    const dynamicStyling: React.CSSProperties = {};
    if (appContext.isTransparentSurface) {
        dynamicStyling.clipPath = appContext.settings.shape;
    }

    const draw = async () => {
        const ctx = canvas.current?.getContext('2d');
        const currentDraw = Date.now();
        lastDraw.current = currentDraw;

        const angle = Math.atan2(currentPosition.x - lastPosition.x, currentPosition.y - lastPosition.y);
        const zoomLevel = appContext.settings.zoomLevel;
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

        const tiles = getMapTiles(currentPosition, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel, renderAsCompass ? -angle : 0);
        const offset = toMinimapCoordinate(currentPosition, currentPosition, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);

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

            const imgPos = toMinimapCoordinate(currentPosition, marker.pos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
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

    // Store the `draw` function in a ref object, so we can always access the latest one.
    const drawRef = useRef(draw);
    drawRef.current = draw;

    function redraw() {
        // Use the `draw` in the ref to get the most up-to-date one
        drawRef.current();
    }

    function setPosition(pos: Vector2) {
        if (pos.x === currentPosition.x && pos.y === currentPosition.y) {
            return;
        }

        setLastPosition(currentPosition);
        setCurrentPosition(pos);
    }

    useEffect(() => {
        redraw();
    }, [currentPosition, appContext]);

    useEffect(() => {
        function handleTileDownloadingCountChange(count: number) {
            setTilesDownloading(count);
            if (count === 0) {
                redraw();
            }
        }

        function handleMarkersLoaded() {
            redraw();
        }

        const tileRegistration = tileCache.registerOnTileDownloadingCountChange(handleTileDownloadingCountChange);
        const markerRegistration = markerCache.registerOnMarkersLoaded(handleMarkersLoaded);
        return () => {
            tileRegistration();
            markerRegistration();
        };
    }, []);

    useEffect(() => {
        // Expose the setPosition and getMarkers window on the global Window object
        (window as any).setPosition = setPosition;
        (window as any).getMarkers = getMarkers;

        window.addEventListener('resize', redraw);

        const callbackUnregister = registerEventCallback(info => {
            setPosition(info.position);
        });

        return function () {
            window.removeEventListener('resize', redraw);
            callbackUnregister();
        };
    }, [currentPosition]);

    return <div className={clsx(classes.minimap, className)}>
        <canvas
            ref={canvas}
            className={clsx(classes.canvas)}
            style={dynamicStyling}
        />
        <div className={classes.cacheStatus}>
            {tilesDownloading > 0 &&
                <p>Loading {tilesDownloading} tiles</p>
            }
        </div>
    </div>;
}
