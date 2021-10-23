import { positionUpdateRate } from '@/logic/hooks';

export const townZoomDistance = 10000;
export const mapFastZoom = 100;
export const mapSlowZoom = 1000;

export const angleInterpolationTime = positionUpdateRate;
export const locationInterpolationTime = positionUpdateRate;
export const tooLargeDistance = positionUpdateRate;
