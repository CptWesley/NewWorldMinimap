import React, { useEffect, useRef } from 'react';
import { getTileBitmap } from './logic/tiles';
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

                const bitmap = await getTileBitmap(109, 205);
                ctx.drawImage(bitmap, 10, 10);
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
