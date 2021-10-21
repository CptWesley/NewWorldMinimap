import { OWGamesEvents } from '@overwolf/overwolf-api-ts/dist';
import { interestingFeatures } from '../OverwolfWindows/consts';

export const positionUpdateRate = 1000;

const listener = new OWGamesEvents({
    onInfoUpdates: onUpdate,
    onNewEvents: onUpdate,
}, interestingFeatures);

listener.start();

type cb = (info: PlayerData) => void;

const callbacks: Set<cb> = new Set();

export function registerEventCallback(callback: cb) {
    callbacks.add(callback);
    return () => {
        callbacks.delete(callback);
    };
}

function onUpdate(info: any) {
    const playerData = transformData(info);

    if (!playerData) {
        return;
    }

    for (const cb of callbacks) {
        cb(playerData);
    }
}

function transformData(info: any): PlayerData | undefined {
    if (info.success && info.res && info.res.game_info) {
        info = info.res.game_info;
    }

    if (!info.location) {
        return undefined;
    }

    const locationParts = (info.location as string).trim().split(',');

    const position = {
        x: parseFloat(locationParts[1]),
        y: parseFloat(locationParts[3]),
        z: parseFloat(locationParts[5]),
    };

    const rotation = {
        x: parseFloat(locationParts[7]),
        y: parseFloat(locationParts[9]),
        z: parseFloat(locationParts[11]),
    };

    const compass = locationParts[13].trim();

    return {
        position,
        rotation,
        compass,
        map: info.map ? (info.map as string).trim() : undefined,
        name: info.player_name ? (info.player_name as string).trim() : undefined,
        world: info.world_name ? (info.world_name as string).trim() : undefined,
    };
}

setInterval(() => overwolf.games.events.getInfo(onUpdate), positionUpdateRate);
