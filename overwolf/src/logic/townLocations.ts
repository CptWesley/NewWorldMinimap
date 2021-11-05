import { squaredDistance } from './util';

export const townLocations = {
    'cutlass_keys': {
        x: 7935,
        y: 1916,
    },
    'first_light': {
        x: 8859,
        y: 711,
    },
    'windsward': {
        x: 9346,
        y: 2700,
    },
    'monarchs_bluff': {
        x: 7361,
        y: 3714,
    },
    'reekwater': {
        x: 11006,
        y: 3290,
    },
    'everfall': {
        x: 8913,
        y: 4222,
    },
    'ebonscale_reach': {
        x: 7281,
        y: 5390,
    },
    'brightwood': {
        x: 9596,
        y: 6341,
    },
    'weavers_fen': {
        x: 11447,
        y: 5341,
    },
    'restless_shore': {
        x: 12993,
        y: 4430,
    },
    'mourningdale': {
        x: 13179,
        y: 6970,
    },
    'eastburn': {
        x: 10060,
        y: 7503,
    },
    'cleaves_point': {
        x: 8872,
        y: 7951,
    },
    'mountainhome': {
        x: 9212,
        y: 9060,
    },
    'mountainrise': {
        x: 10329,
        y: 8928,
    },
    'valor_hold': {
        x: 11141,
        y: 7310,
    },
    'last_stand': {
        x: 12079,
        y: 8521,
    },
};

export function getNearestTown(position: Vector2) {
    let distance = Infinity;
    let name = 'none';

    for (const [townName, townPos] of Object.entries(townLocations)) {
        const townDistance = squaredDistance(position, townPos);

        if (townDistance < distance) {
            distance = townDistance;
            name = townName;
        }
    }

    return { name, distance };
}
