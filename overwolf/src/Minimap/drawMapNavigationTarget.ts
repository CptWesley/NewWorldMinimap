import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';

export default function drawMapNavigationTarget(params: MapRendererParameters, iconParams: MapIconRendererParameters, target: Vector2 | undefined) {
    if (!target) {
        return;
    }

    const {
        context: ctx,
    } = params;

    const {
        mapIconsCache,
    } = iconParams;

    const icon = mapIconsCache.getIcon('nav', 'nav');
    if (icon) {
        ctx.drawImage(icon, target.x - icon.width / 2, target.y - icon.height);
    }
}
