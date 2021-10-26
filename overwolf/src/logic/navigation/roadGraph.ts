
export type RoadGraph = Record<number, GraphNode | undefined> & {
    /** The non-inclusive highest node index in the road graph. */
    max: number,
}

const data: RoadGraph = require('./roadGraphData.js');

let max = 0;
for (const k in data) {
    max = Math.max(max, Number(k));
}

data.max = max;
export const roadGraph: RoadGraph = data;
