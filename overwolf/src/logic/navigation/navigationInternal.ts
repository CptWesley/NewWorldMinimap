import { distance, squaredDistance } from '../util';
import { RoadGraph, roadGraph } from './roadGraph';

export function findPath(start: Vector2, end: Vector2) {
    const result: Vector2[] = [start];
    const closestToStart = findNearestNode(roadGraph, start);
    const closestToEnd = findNearestNode(roadGraph, end);

    const chain = aStar(
        roadGraph,
        closestToStart,
        closestToEnd,
        (g, s) => {
            const node = g[s];
            return node ? distance(node.position, end) : Infinity;
        });

    for (const i of chain) {
        result.push(roadGraph[i]!.position);
    }

    result.push(end);
    return result;
}

function findNearestNode(graph: RoadGraph, pos: Vector2) {
    let distance = Infinity;
    let closest = -1;

    for (let i = 0; i < graph.max; i++) {
        const node = graph[i];
        if (!node) { continue; }
        const candidateDistance = squaredDistance(pos, node.position);
        if (candidateDistance < distance) {
            distance = candidateDistance;
            closest = i;
        }
    }

    return closest;
}

function reconstructPath(cameFrom: Map<number, number>, current: number) {
    let cur: number | undefined = current;
    let totalPath = [cur];
    while (true) {
        cur = cameFrom.get(cur);

        if (!cur) {
            return totalPath;
        }

        totalPath = [cur, ...totalPath];
    }
}

function aStar(graph: RoadGraph, start: number, goal: number, h: (g: RoadGraph, s: number) => number) {
    const openSet = new Set<number>();
    openSet.add(start);
    const cameFrom = new Map<number, number>();
    const gScore = new Map<number, number>();
    const fScore = new Map<number, number>();

    for (let i = 0; i < graph.max; i++) {
        gScore.set(i, Infinity);
        fScore.set(i, Infinity);
    }

    gScore.set(start, 0);
    fScore.set(start, h(graph, start));

    let current = start;

    while (openSet.size > 0) {
        current = findLowestFScore(openSet, fScore);

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);
        const curNode = graph[current];
        if (!curNode) {
            // The node does not exist in the graph (anymore).
            continue;
        }

        for (const neighbor of curNode.neighbors) {
            const nNode = graph[neighbor];

            if (!nNode) {
                // The node does not exist in the graph (anymore).
                continue;
            }

            const tentativeGScore = gScore.get(current)! + distance(curNode.position, nNode.position);
            if (tentativeGScore < gScore.get(neighbor)!) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + h(graph, neighbor));
                openSet.add(neighbor);
            }
        }
    }

    return [];
}

function findLowestFScore(openSet: Set<number>, fScore: Map<number, number>) {
    let score = Infinity;
    let lowest = -1;

    for (const index of openSet) {
        const candidateScore = fScore.get(index);

        if (candidateScore! < score) {
            score = candidateScore!;
            lowest = index;
        }
    }

    return lowest;
}
