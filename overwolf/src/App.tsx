import React, { useEffect, useRef } from 'react';
import { getTileBitmap, getTiles } from './logic/tiles';
import { makeStyles } from './theme';

const useStyles = makeStyles()({
    canvas: {
        width: '100%',
        height: '100%',
    },
});

export default function App() {
    const { classes } = useStyles();

    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function draw() {
            const ctx = canvas.current?.getContext('2d');
            if (ctx) {
                ctx.canvas.width = ctx.canvas.clientWidth;
                ctx.canvas.height = ctx.canvas.clientHeight;

                // const bitmap = await getTileBitmap(109, 205);
                // ctx.drawImage(bitmap, 10, 10);
                const bitmaps = getTiles(7728.177, 1988.299);

                for (let x = 0; x < bitmaps.length; x++) {
                    for (let y = 0; y < bitmaps.length; y++) {
                        const bitmap = await bitmaps[x][y];
                        ctx.drawImage(bitmap, bitmap.width * x, bitmap.height * y);
                    }
                }
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
