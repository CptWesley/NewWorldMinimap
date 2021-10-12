import React, { useEffect, useRef, useState } from 'react';
import { GetPlayerIcon } from './logic/icons';
import { getMarkers } from './logic/markers';
import { getTiles, toMinimapCoordinate } from './logic/tiles';
import { makeStyles } from './theme';

const useStyles = makeStyles()({
    canvas: {
        width: '100%',
        height: '100%',
    },
});

export default function Minimap() {
    const { classes } = useStyles();

    const [position, setPosition] = useState<Vector2>({ x: 7728.177, y: 1988.299 });
    const canvas = useRef<HTMLCanvasElement>(null);

    let lastDraw = 0;

    const draw = async () => {
        const ctx = canvas.current?.getContext('2d');
        const currentDraw = Date.now();
        lastDraw = currentDraw;

        if (!ctx) {
            return;
        }

        if (lastDraw !== currentDraw) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        const tiles = getTiles(position, ctx.canvas.width, ctx.canvas.height);
        const offset = toMinimapCoordinate(position, position, ctx.canvas.width, ctx.canvas.height);

        let toDraw: Marker[] = [];

        for (let x = 0; x < tiles.length; x++) {
            const row = tiles[x];
            for (let y = 0; y < row.length; y++) {
                const tile = row[y];
                const bitmap = await tile.image;

                if (lastDraw !== currentDraw) {
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
            const imgPos = toMinimapCoordinate(position, marker.pos, ctx.canvas.width, ctx.canvas.height);
            const imgPosCorrected = { x: imgPos.x - offset.x + centerX, y: imgPos.y - offset.y + centerY };

            if (lastDraw !== currentDraw) {
                return;
            }

            ctx.drawImage(marker.icon, imgPosCorrected.x, imgPosCorrected.y);
        }

        const playerIcon = await GetPlayerIcon();

        if (lastDraw !== currentDraw) {
            return;
        }

        ctx.drawImage(playerIcon, Math.floor(centerX - playerIcon.width / 2), Math.floor(centerY - playerIcon.height / 2));
    };

    // Store the `draw` function in a ref object, so we can always access the latest one.
    const drawRef = useRef(draw);
    drawRef.current = draw;

    function redraw() {
        // Use the `draw` in the ref to get the most up-to-date one
        drawRef.current();
    }

    useEffect(() => {
        redraw();
    }, [position]);

    useEffect(() => {
        // Expose the setPosition and getMarkers window on the global Window object
        (window as any).setPosition = setPosition;
        (window as any).getMarkers = getMarkers;

        window.addEventListener('resize', redraw);

        return function () {
            window.removeEventListener('resize', redraw);
        };
    }, []);

    return <canvas
        ref={canvas}
        className={classes.canvas}
    />;
}
