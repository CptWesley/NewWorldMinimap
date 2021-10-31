import UnloadingEvent from './unloadingEvent';

type OverwolfUpdateWindow = typeof window & {
    NWMM_registerAppUpdateCallback: typeof onAppUpdateEvent.register;
}

type OnAppUpdateListener = (newerVersion: string) => void;
const onAppUpdateEvent = new UnloadingEvent<OnAppUpdateListener>('onAppUpdate');
const isBackground = NWMM_APP_WINDOW === 'background';

export const registerAppUpdateCallback = isBackground
    ? onAppUpdateEvent.register
    : (overwolf.windows.getMainWindow() as OverwolfUpdateWindow).NWMM_registerAppUpdateCallback;

export function initializeAppUpdates() {
    if (!isBackground) {
        return;
    }

    setInterval(() => overwolf.extensions.checkForExtensionUpdate(onUpdateCheck), 300000);
}

function onUpdateCheck(data: overwolf.extensions.CheckForUpdateResult) {
    if (!data.success || !data.state) {
        return;
    }

    if (data.state === 'UpdateAvailable' && data.updateVersion) {
        onAppUpdateEvent.fire(data.updateVersion);
    }
}
