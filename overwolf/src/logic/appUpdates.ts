import UnloadingEvent from './unloadingEvent';

const updateIntervalTimeMS = 300_000;

type OverwolfUpdateWindow = typeof window & {
    NWMM_appUpdates: {
        registerAppUpdateCallback: typeof onAppUpdateEvent.register,
        downloadUpdate: typeof downloadUpdateInternal,
    },
}

interface IAppUpdateAvailable {
    state: overwolf.extensions.ExtensionUpdateState.UpdateAvailable;
    version: string | undefined;
}

interface IAppUpdateDownloaded {
    state: overwolf.extensions.ExtensionUpdateState.PendingRestart;
}

interface IAppUpdateFailed {
    state: 'UpdateFailed';
    error: string;
}

export type AppUpdateInfo = IAppUpdateAvailable | IAppUpdateDownloaded | IAppUpdateFailed;

type OnAppUpdateListener = (info: AppUpdateInfo) => void;
const onAppUpdateEvent = new UnloadingEvent<OnAppUpdateListener>('onAppUpdate');
const isBackground = NWMM_APP_WINDOW === 'background';

export const registerAppUpdateCallback = isBackground
    ? onAppUpdateEvent.register
    : (overwolf.windows.getMainWindow() as OverwolfUpdateWindow).NWMM_appUpdates.registerAppUpdateCallback;
export const downloadAppUpdate = isBackground
    ? downloadUpdateInternal
    : (overwolf.windows.getMainWindow() as OverwolfUpdateWindow).NWMM_appUpdates.downloadUpdate;

export function initializeAppUpdates() {
    if (!isBackground) {
        return;
    }

    (window as OverwolfUpdateWindow).NWMM_appUpdates = {
        registerAppUpdateCallback: onAppUpdateEvent.register,
        downloadUpdate: downloadUpdateInternal,
    };
    setInterval(() => overwolf.extensions.checkForExtensionUpdate(onUpdateCheck), updateIntervalTimeMS);
}

function onUpdateCheck(data: overwolf.extensions.CheckForUpdateResult) {
    if (!data.success || !data.state || data.state !== overwolf.extensions.ExtensionUpdateState.UpdateAvailable) {
        return;
    }

    onAppUpdateEvent.fire({
        state: overwolf.extensions.ExtensionUpdateState.UpdateAvailable,
        version: data.updateVersion,
    });
}

function downloadUpdateInternal() {
    overwolf.extensions.updateExtension(e => {
        if (e.success) {
            onAppUpdateEvent.fire({
                state: overwolf.extensions.ExtensionUpdateState.PendingRestart,
            });
        } else {
            onAppUpdateEvent.fire({
                state: 'UpdateFailed',
                error: e.error || 'unknown',
            });
        }
    });
}

(window as any).doUpdate = function (st: any, vr: any) {
    onAppUpdateEvent.fire({
        state: st,
        version: vr,
    });
};

(window as any).failUpdate = function (err: string) {
    onAppUpdateEvent.fire({
        state: 'UpdateFailed',
        error: err,
    });
};
