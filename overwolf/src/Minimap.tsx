import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { registerEventCallback } from './logic/hooks';
import { GetPlayerIcon } from './logic/icons';
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

    const draw = async () => {
        const ctx = canvas.current?.getContext('2d');
        const currentDraw = Date.now();
        lastDraw.current = currentDraw;

        const angle = Math.atan2(currentPosition.x - lastPosition.x, currentPosition.y - lastPosition.y);

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

        const tiles = getTiles(currentPosition, ctx.canvas.width, ctx.canvas.height);
        const offset = toMinimapCoordinate(currentPosition, currentPosition, ctx.canvas.width, ctx.canvas.height);

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
                    bitmap.width * x + Math.floor(centerX) - offset.x,
                    bitmap.height * y + Math.floor(centerY) - offset.y
                );

                toDraw = toDraw.concat(await tile.markers);
            }
        }
        for (const marker of toDraw) {
            const imgPos = toMinimapCoordinate(currentPosition, marker.pos, ctx.canvas.width, ctx.canvas.height);
            const imgPosCorrected = { x: imgPos.x - offset.x + centerX, y: imgPos.y - offset.y + centerY };

            if (lastDraw.current !== currentDraw) {
                return;
            }

            ctx.drawImage(marker.icon, imgPosCorrected.x - marker.icon.width / 2, imgPosCorrected.y - marker.icon.height / 2);
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
    }, [currentPosition]);

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
