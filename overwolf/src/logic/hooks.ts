import { OWGamesEvents } from '@overwolf/overwolf-api-ts/dist';
import { interestingFeatures } from '../OverwolfWindows/consts';
import UnloadingEvent from './unloadingEvent';

type OverwolfHookWindow = typeof window & {
    NWMM_registerEventCallback: typeof onPlayerDataUpdateEvent.register;
}

export const positionUpdateRate = 500;

type OnPlayerDataUpdateListener = (info: PlayerData) => void;

const onPlayerDataUpdateEvent = new UnloadingEvent<OnPlayerDataUpdateListener>('onPlayerDataUpdate');
const isBackground = NWMM_APP_WINDOW === 'background';

export const registerEventCallback = isBackground
    ? onPlayerDataUpdateEvent.register
    : (overwolf.windows.getMainWindow() as OverwolfHookWindow).NWMM_registerEventCallback;

function onUpdate(info: any) {
    const playerData = transformData(info);

    if (!playerData) {
        return;
    }

    onPlayerDataUpdateEvent.fire(playerData);
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

    const rotation = -(parseFloat(locationParts[11]) - 90) * Math.PI / 180;

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

export function initializeHooks() {
    if (!isBackground) {
        return;
    }

    const listener = new OWGamesEvents({
        onInfoUpdates: onUpdate,
        onNewEvents: onUpdate,
    }, interestingFeatures);
    listener.start();
    setInterval(() => overwolf.games.events.getInfo(onUpdate), positionUpdateRate);
    (window as OverwolfHookWindow).NWMM_registerEventCallback = onPlayerDataUpdateEvent.register;
}
