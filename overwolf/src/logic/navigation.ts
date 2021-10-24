import { squaredDistance } from './util';

export function roadsToGraph(roads: Vector2[]) {
    const result: GraphNode[] = [];

    for (let i = 0; i < roads.length; i++) {
        const position = roads[i];
        const neighbors: number[] = [];

        for (let j = 0; j < roads.length; j++) {
            if (i === j) {
                continue;
            }

            const otherPosition = roads[j];
            const distance = squaredDistance(position, otherPosition);

            if (distance < 200) {
                neighbors.push(j);
            }
        }

        const node = { position, neighbors };
        result.push(node);
    }

    return result;
}

export function findPath(graph: GraphNode[], start: Vector2, end: Vector2) {
    const result: Vector2[] = [];
    result.push(start);
    const closestToStart = findNearestNode(graph, start);
    const closestToEnd = findNearestNode(graph, end);

    const chain = aStar(graph, closestToStart, closestToEnd, (g, s) => Math.sqrt(squaredDistance(g[s].position, end)))!;

    for (const i of chain) {
        result.push(graph[i].position);
    }

    result.push(end);
    return result;
}

function findNearestNode(graph: GraphNode[], pos: Vector2) {
    let distance = Infinity;
    let closest = -1;

    for (let i = 0; i < graph.length; i++) {
        const candidateDistance = squaredDistance(pos, graph[i].position);
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

function aStar(graph: GraphNode[], start: number, goal: number, h: (g: GraphNode[], s: number) => number) {
    const openSet = new Set<number>();
    openSet.add(start);
    const cameFrom = new Map<number, number>();
    const gScore = new Map<number, number>();
    const fScore = new Map<number, number>();

    for (let i = 0; i < graph.length; i++) {
        gScore.set(i, Infinity);
        fScore.set(i, Infinity);
    }

    gScore.set(start, 0);
    fScore.set(start, h(graph, start));

    let current = start;

    while (openSet.size > 0) {
        console.log(openSet.size);
        current = findLowestFScore(openSet, fScore);

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);
        const curNode = graph[current];
        for (const neighbor of curNode.neighbors) {
            const nNode = graph[neighbor];
            const tentativeGScore = gScore.get(current)! + Math.sqrt(squaredDistance(curNode.position, nNode.position));
            if (tentativeGScore < gScore.get(neighbor)!) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + h(graph, neighbor));
                openSet.add(neighbor);
            }
        }
    }

    return undefined;
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

export function findNearestTwo(graph: GraphNode[], point: Vector2) {
    let distance1 = Infinity;
    let distance2 = Infinity;
    let node1 = undefined;
    let node2 = undefined;

    for (let i = 0; i < graph.length; i++) {
        const d = squaredDistance(graph[i].position, point);

        if (d < distance2) {
            distance2 = d;
            node2 = i;

            if (distance2 < distance1) {
                const tempD = distance1;
                const tempN = node1;

                distance1 = distance2;
                node1 = node2;
                distance2 = tempD;
                node2 = tempN;
            }
        }
    }

    return { a: node1!, b: node2! };
}
