import { Interpolator } from '@/Minimap/useInterpolation';
import { getIconName } from './icons';

export function getNumberInterpolator(animationInterpolation: AnimationInterpolation): Interpolator<number> {
    switch (animationInterpolation) {
        case 'cosine': return interpolateNumbersCosine;
        case 'linear': return interpolateNumbersLinear;
        case 'none': return undefined;
    }
}

export function getAngleInterpolator(animationInterpolation: AnimationInterpolation): Interpolator<number> {
    switch (animationInterpolation) {
        case 'cosine': return interpolateAngleLinear;
        case 'linear': return interpolateAngleLinear;
        case 'none': return undefined;
    }
}

export function getVector2Interpolator(animationInterpolation: AnimationInterpolation): Interpolator<Vector2> {
    switch (animationInterpolation) {
        case 'cosine': return interpolateVectorsCosine;
        case 'linear': return interpolateVectorsLinear;
        case 'none': return undefined;
    }
}

export function vector2Equal(a: Vector2, b: Vector2) {
    return a.x === b.x && a.y === b.y;
}

function interpolateNumbersLinear(start: number, end: number, progress: number) {
    return start * (1 - progress) + end * progress;
}

function interpolateNumbersCosine(start: number, end: number, percentage: number) {
    const mu = computeCosineInterpolationMu(percentage);
    return start * (1 - mu) + end * mu;
}

export function compareNames([, v1]: [string, any], [, v2]: [string, any]) {
    const s1 = v1 as IconTypeSetting;
    const s2 = v2 as IconTypeSetting;

    const n1 = getIconName(s1.category, s1.type);
    const n2 = getIconName(s2.category, s2.type);

    return n1.localeCompare(n2);
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

export function distance(start: Vector2, end: Vector2) {
    return Math.sqrt(squaredDistance(start, end));
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

export function onCanvas(pos: Vector2, width: number, height: number, screenWidth: number, screenHeight: number) {
    const lowerX = pos.x - width / 2;
    const upperX = pos.x + width / 2;
    const lowerY = pos.y - height / 2;
    const upperY = pos.y + height / 2;

    return lowerX >= 0 && upperX < screenWidth && lowerY >= 0 && upperY < screenHeight;
}
