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

export function interpolateVectorsLinear(start: Vector2, end: Vector2, percentage: number) {
    return {
        x: start.x * (1 - percentage) + end.x * percentage,
        y: start.y * (1 - percentage) + end.y * percentage,
    };
}

export function interpolateAngleLinear(start: number, end: number, percentage: number) {
    const bestEnd = correctEndAngle(start, end);
    return start * (1 - percentage) + bestEnd * percentage;
}

export function interpolateVectorsCosine(start: Vector2, end: Vector2, percentage: number) {
    const mu = computeCosineInterpolationMu(percentage);
    return {
        x: start.x * (1 - mu) + end.x * mu,
        y: start.y * (1 - mu) + end.y * mu,
    };
}

export function interpolateAngleCosine(start: number, end: number, percentage: number) {
    const mu = computeCosineInterpolationMu(percentage);
    const bestEnd = correctEndAngle(start, end);
    return start * (1 - mu) + bestEnd * mu;
}

function correctEndAngle(start: number, end: number) {
    const alternativeEnd1 = end - Math.PI * 2;
    const alternativeEnd2 = end + Math.PI * 2;

    const dif0 = Math.abs(end - start);
    const dif1 = Math.abs(alternativeEnd1 - start);
    const dif2 = Math.abs(alternativeEnd2 - start);

    const minDif = Math.min(dif0, dif1, dif2);
    const bestEnd = minDif === dif0 ? end : minDif === dif1 ? alternativeEnd1 : alternativeEnd2;

    return bestEnd;
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

export function predictVector(start: Vector2, end: Vector2) {
    const xDif = end.x - start.x;
    const yDif = end.y - start.y;
    const x = end.x + xDif;
    const y = end.y + yDif;

    return { x, y };
}

export function predictAngle(start: number, end: number) {
    const bestEnd = correctEndAngle(start, end);
    const dif = bestEnd - start;
    return bestEnd + dif;
}

export function generateRandomToken() {
    return Math.random().toString(36).substr(2);
}
