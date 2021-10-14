export function compareNames([, v1]: [string, any], [, v2]: [string, any]) {
    const s1 = v1 as IconTypeSetting;
    const s2 = v2 as IconTypeSetting;
    return s1.name.localeCompare(s2.name);
}

export function rotateAround(center: Vector2, point: Vector2, angle: number) {
    const xDif = point.x - center.x;
    const yDif = point.y - center.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = center.x + xDif * cos - yDif * sin;
    const y = center.y + xDif * sin + yDif * cos;

    return { x, y };
}
