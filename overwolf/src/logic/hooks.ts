import { OWGamesEvents } from '@overwolf/overwolf-api-ts/dist';
import { interestingFeatures } from '../OverwolfWindows/consts';

const listener = new OWGamesEvents({
    onInfoUpdates: onUpdate,
    onNewEvents: onUpdate,
}, interestingFeatures);

listener.start();

type cb = (info: any) => void;

const callbacks: cb[] = [];

export function registerEventCallback(callback: cb) {
    callbacks.push(callback);
}

function onUpdate(info: any) {
    console.log('On update!');
    for (const cb of callbacks) {
        cb(info);
    }
}

setInterval(() => overwolf.games.events.getInfo(onUpdate), 100);
