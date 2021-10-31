export default function setTextStyle(ctx: CanvasRenderingContext2D, iconScale: number) {
    ctx.textAlign = 'center';
    ctx.font = Math.round(iconScale * 10) + 'px Lato, sans-serif';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2.5;
}
