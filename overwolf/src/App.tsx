import React, { useEffect, useRef, useState } from 'react';
import { getMarkers } from './logic/markers';
import PlayerIcon from './Icons/MapIcons/PlayerIcon';
import { svgMapIconToImageBitmap } from './logic/svg';
import { getTiles, toMinimapCoordinate } from './logic/tiles';
import { makeStyles } from './theme';

const useStyles = makeStyles()({
    canvas: {
        width: '100%',
        height: '100%',
    },
});

let playerDebugIcon: ImageBitmap | undefined;
async function createPlayerDebugIcon() {
    playerDebugIcon = await svgMapIconToImageBitmap(PlayerIcon);
}
createPlayerDebugIcon();

export default function App() {
    const { classes } = useStyles();

    const [position, setPosition] = useState<Vector2>({ x: 7728.177, y: 1988.299 });
    const canvas = useRef<HTMLCanvasElement>(null);
    const draw = async () => {
        const ctx = canvas.current?.getContext('2d');
        if (ctx) {
            ctx.canvas.width = ctx.canvas.clientWidth;
            ctx.canvas.height = ctx.canvas.clientHeight;

            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2;

            const tiles = getTiles(position, ctx.canvas.width, ctx.canvas.height);
            const offset = toMinimapCoordinate(position, position, ctx.canvas.width, ctx.canvas.height);

            for (let x = 0; x < tiles.length; x++) {
                const row = tiles[x];
                for (let y = 0; y < row.length; y++) {
                    const tile = row[y];
                    const bitmap = await tile.image;
                    ctx.drawImage(await tile.image,
                        bitmap.width * x + Math.floor(centerX) - offset.x,
                        bitmap.height * y + Math.floor(centerY) - offset.y
                    );
                }
            }

            if (playerDebugIcon) {
                ctx.drawImage(playerDebugIcon, Math.floor(centerX - playerDebugIcon.width / 2), Math.floor(centerY - playerDebugIcon.height / 2));
            }
        }
    };

    // Store the `draw` function in a ref object, so we can always access the latest one.
    const drawRef = useRef(draw);
    drawRef.current = draw;

    useEffect(() => {
        // Expose the setPosition window on the global Window object
        (window as any).setPosition = setPosition;
        (window as any).getMarkers = getMarkers;

        function redraw() {
            // Use the `draw` in the ref to get the most up-to-date one
            drawRef.current();
        }

        // Draw for the first time
        draw();
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
