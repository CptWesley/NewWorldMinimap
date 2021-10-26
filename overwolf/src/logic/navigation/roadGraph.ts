/** A sparse array of graph nodes. */
export type RoadGraph = Record<number, GraphNode | undefined> & {
    /** The non-inclusive highest node index in the road graph. */
    max: number,
}

const data: RoadGraph = require('./roadGraphData.js');

// Decide the maximum key in the data
let max = 0;
for (const k in data) {
    const numeric = Number(k);
    if (isNaN(numeric)) { continue; }
    max = Math.max(max, numeric + 1);
}

data.max = max;
export const roadGraph: RoadGraph = data;
