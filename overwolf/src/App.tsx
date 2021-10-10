import React, { useEffect, useRef } from 'react';
import { getTiles, toMinimapCoordinate } from './logic/tiles';
import { makeStyles } from './theme';

let lastPos = { x: 7728.177, y: 1988.299 };

const useStyles = makeStyles()({
    canvas: {
        width: '100%',
        height: '100%',
    },
});

export function setPosition(newPos: Vector2) {
    lastPos = newPos;
    window.dispatchEvent(new Event('resize', {}));
}

export default function App() {
    const { classes } = useStyles();

    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function draw() {
            const ctx = canvas.current?.getContext('2d');
            if (ctx) {
                ctx.canvas.width = ctx.canvas.clientWidth;
                ctx.canvas.height = ctx.canvas.clientHeight;

                const bitmaps = getTiles(lastPos, ctx.canvas.width, ctx.canvas.height);
                const offset = toMinimapCoordinate(lastPos, lastPos, ctx.canvas.width, ctx.canvas.height);

                for (let x = 0; x < bitmaps.length; x++) {
                    const row = bitmaps[x];
                    for (let y = 0; y < row.length; y++) {
                        const bitmap = await row[y];
                        ctx.drawImage(bitmap,
                            bitmap.width * x + Math.floor(ctx.canvas.width / 2) - offset.x,
                            bitmap.height * y + Math.floor(ctx.canvas.height / 2) - offset.y
                        );
                    }
                }

                ctx.fillStyle = 'red';
                ctx.fillRect(ctx.canvas.width / 2 - 16, ctx.canvas.height / 2 - 16, 32, 32);
            }
        }

        window.addEventListener('resize', draw);
        return function () {
            window.removeEventListener('resize', draw);
        };
    }, []);

    return <canvas
        ref={canvas}
        className={classes.canvas}
    />;
}
