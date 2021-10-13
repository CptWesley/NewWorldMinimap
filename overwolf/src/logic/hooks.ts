import { OWGamesEvents } from '@overwolf/overwolf-api-ts/dist';
import { interestingFeatures } from '../OverwolfWindows/consts';

const listener = new OWGamesEvents({
    onInfoUpdates: onUpdate,
    onNewEvents: onUpdate,
}, interestingFeatures);

listener.start();

type cb = (info: any) => void;

const callbacks: Set<cb> = new Set();

export function registerEventCallback(callback: cb) {
    callbacks.add(callback);
    return () => {
        callbacks.delete(callback);
    };
}

function onUpdate(info: any) {
    for (const cb of callbacks) {
        cb(info);
    }
}

setInterval(() => overwolf.games.events.getInfo(onUpdate), 500);
