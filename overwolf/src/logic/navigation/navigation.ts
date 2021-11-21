import { squaredDistance } from '../util';
import { findPath } from './navigationInternal';

let navPath: Vector2[] | undefined;
let lastNavUpdate: number;

function resetNav() {
    setPath(undefined);
}

function setNav(start: Vector2, end: Vector2) {
    const path = findPath(start, end);
    setPath(path);
    return path;
}

function getNavTarget() {
    const path = navPath;

    if (!path || path.length < 1) {
        return undefined;
    }

    return path[path.length - 1];
}

function getNavPath(pos: Vector2) {
    const path = navPath;
    if (!path) {
        return undefined;
    }

    const { index, distance } = findNearestNode(path, pos);
    const time = performance.now() - lastNavUpdate;

    if (distance > 500 && time > 5000) {
        return setNav(pos, path[path.length - 1]);
    }

    path.splice(0, index, pos);
    return path;
}

export function initializeNavigation() {
    return {
        setNav,
        resetNav,
        getNavTarget,
        getNavPath,
    };
}

function setPath(path: Vector2[] | undefined) {
    navPath = path;
    lastNavUpdate = performance.now();
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
