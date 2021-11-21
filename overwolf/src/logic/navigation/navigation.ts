import AppPlatform from '../platform';
import { squaredDistance } from '../util';
import { findPath } from './navigationInternal';

const isBackground = NWMM_APP_WINDOW === 'background';
const mainWindow = AppPlatform.getMainWindow() as any;

export function resetNav() {
    setPath(undefined);
}

export function setNav(start: Vector2, end: Vector2) {
    const path = findPath(start, end);
    setPath(path);
    return path;
}

export function getNavTarget() {
    const path = mainWindow.navPath as Vector2[] | undefined;

    if (!path || path.length < 1) {
        return undefined;
    }

    return path[path.length - 1];
}

export function getNavPath(pos: Vector2) {
    const path = mainWindow.navPath as Vector2[] | undefined;
    if (!path) {
        return undefined;
    }

    const { index, distance } = findNearestNode(path, pos);
    const time = performance.now() - mainWindow.lastNavUpdate;

    if (distance > 500 && time > 5000) {
        return setNav(pos, path[path.length - 1]);
    }

    path.splice(0, index, pos);
    return path;
}

export function initializeNavigation() {
    if (!isBackground) {
        return;
    }
}

function setPath(path: Vector2[] | undefined) {
    mainWindow.navPath = path;
    mainWindow.lastNavUpdate = performance.now();
}

function findNearestNode(path: Vector2[], pos: Vector2) {
    let distance = Infinity;
    let closest = -1;

    for (let i = 1; i < path.length; i++) {
        const candidateDistance = squaredDistance(pos, path[i]);
        if (candidateDistance < distance) {
            distance = candidateDistance;
            closest = i;
        }
    }

    return { index: closest, distance };
}
