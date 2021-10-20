import common from './common.json';
import markers from './markers.json';
import customMarkers from './customMarkers.json';

export const es = {
    common,
    markers: {
        ...markers,
        custom: customMarkers,
    },
};
