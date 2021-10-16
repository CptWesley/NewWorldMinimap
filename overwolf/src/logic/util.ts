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

export function interpolateVectors(start: Vector2, end: Vector2, percentage: number) {
    const mu = computeCosineInterpolationMu(percentage);

    return {
        x: start.x * (1 - mu) + end.x * mu,
        y: start.y * (1 - mu) + end.y * mu,
    };
}

export function interpolateAngle(start: number, end: number, percentage: number) {
    const mu = computeCosineInterpolationMu(percentage);

    return start * (1 - mu) + end * mu;
}

function computeCosineInterpolationMu(percentage: number) {
    return (1 - Math.cos(percentage * Math.PI)) / 2;
}

export function squaredDistance(start: Vector2, end: Vector2) {
    const x = end.x - start.x;
    const y = end.y - start.y;

    return x * x + y * y;
}

export function getAngle(start: Vector2, end: Vector2) {
    return Math.atan2(end.x - start.x, end.y - start.y);
}
