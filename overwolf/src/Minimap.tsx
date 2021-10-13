import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { registerEventCallback } from './logic/hooks';
import { getIcon, GetPlayerIcon, setIconScale } from './logic/icons';
import { getMarkers } from './logic/markers';
import { getTiles, toMinimapCoordinate } from './logic/tiles';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const useStyles = makeStyles()({
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

export default function Minimap(props: IProps) {
    const {
        className,
    } = props;
    const { classes } = useStyles();

    const [currentPosition, setCurrentPosition] = useState<Vector2>({ x: 7728.177, y: 1988.299 });
    const [lastPosition, setLastPosition] = useState<Vector2>({ x: 7728.177, y: 1988.299 });
    const canvas = useRef<HTMLCanvasElement>(null);

    const lastDraw = useRef(0);
    const appContext = useContext(AppContext);

    const draw = async () => {
        const ctx = canvas.current?.getContext('2d');
        const currentDraw = Date.now();
        lastDraw.current = currentDraw;

        const angle = Math.atan2(currentPosition.x - lastPosition.x, currentPosition.y - lastPosition.y);
        const zoomLevel = appContext.value.zoomLevel;

        setIconScale(appContext.value.iconScale);

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

        const tiles = getTiles(currentPosition, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
        const offset = toMinimapCoordinate(currentPosition, currentPosition, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);

        let toDraw: Marker[] = [];

        for (let x = 0; x < tiles.length; x++) {
            const row = tiles[x];
            for (let y = 0; y < row.length; y++) {
                const tile = row[y];
                const bitmap = await tile.image;

                if (lastDraw.current !== currentDraw) {
                    return;
                }

                ctx.drawImage(await tile.image,
                    bitmap.width / zoomLevel * x + Math.floor(centerX) - offset.x / zoomLevel,
                    bitmap.height / zoomLevel * y + Math.floor(centerY) - offset.y / zoomLevel,
                    bitmap.width / zoomLevel,
                    bitmap.height / zoomLevel
                );

                toDraw = toDraw.concat(await tile.markers);
            }
        }

        const iconSettings = appContext.value.iconSettings;

        if (!iconSettings) {
            return;
        }

        for (const marker of toDraw) {
            const catSettings = iconSettings.categories[marker.category] as IconCategorySetting;
            if (!catSettings || !catSettings.value) {
                continue;
            }

            const typeSettings = catSettings.types[marker.type] as IconSetting;
            if (typeSettings && !typeSettings.value) {
                continue;
            }

            const imgPos = toMinimapCoordinate(currentPosition, marker.pos, ctx.canvas.width * zoomLevel, ctx.canvas.height * zoomLevel);
            const icon = await getIcon(marker.type, marker.category);
            const imgPosCorrected = { x: imgPos.x / zoomLevel - offset.x / zoomLevel + centerX, y: imgPos.y / zoomLevel - offset.y / zoomLevel + centerY };

            if (lastDraw.current !== currentDraw) {
                return;
            }

            ctx.drawImage(icon, imgPosCorrected.x - icon.width / 2, imgPosCorrected.y - icon.height / 2);

            if (appContext.value.showText) {
                ctx.textAlign = 'center';
                ctx.font = Math.round(icon.height / 1.5) + 'px sans-serif';
                ctx.fillText(marker.type, imgPosCorrected.x, imgPosCorrected.y + icon.height);
            }
        }

        const playerIcon = await GetPlayerIcon();

        if (lastDraw.current !== currentDraw) {
            return;
        }

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(playerIcon, Math.floor(centerX - playerIcon.width / 2), Math.floor(centerY - playerIcon.height / 2));
        ctx.restore();
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
        // Expose the setPosition and getMarkers window on the global Window object
        (window as any).setPosition = setPosition;
        (window as any).getMarkers = getMarkers;

        window.addEventListener('resize', redraw);

        const callbackUnregister = registerEventCallback(info => {
            if (info.success) {
                if (info.res && info.res.game_info && info.res.game_info.location) {
                    const location = JSON.parse(info.res.game_info.location) as Vector2;
                    setPosition(location);
                }
            }
        });

        return function () {
            window.removeEventListener('resize', redraw);
            callbackUnregister();
        };
    }, [currentPosition]);

    return <canvas
        ref={canvas}
        className={clsx(classes.canvas, className)}
    />;
}
