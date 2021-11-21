import { load } from '@/logic/storage';
import { OWGameListener, OWGames, OWWindow } from '@overwolf/overwolf-api-ts';
import { BackgroundWindow, ConcreteWindow, newWorldId, windowNames } from '../consts';

import RunningGameInfo = overwolf.games.RunningGameInfo;
import WindowState = overwolf.windows.WindowStateEx;

export type BackgroundControllerWindow = typeof window & {
    backgroundController: BackgroundController;
}

const bringToFrontWindowStates: string[] = [WindowState.MAXIMIZED, WindowState.NORMAL];

export class BackgroundController {
    private static _instance: BackgroundController;
    private _windows: Record<BackgroundWindow | ConcreteWindow, OWWindow>;
    private _openWindows = new Set<ConcreteWindow>();
    private _NewWorldGameListener: OWGameListener;

    private constructor() {
        this._windows = {
            background: new OWWindow(windowNames.background),
            desktop: new OWWindow(windowNames.desktop),
            inGame: new OWWindow(windowNames.inGame),
        };

        this._NewWorldGameListener = new OWGameListener({
            onGameStarted: this.onGameStarted,
            onGameEnded: this.onGameEnded,
        });
    }

    public static get isSupported() {
        return NWMM_APP_WINDOW === 'background';
    }

    // Implementing the Singleton design pattern
    public static get instance(): BackgroundController {
        if (!this.isSupported) {
            throw new Error('Using BackgroundController directly in this window is not supported.');
        }

        if (!BackgroundController._instance) {
            BackgroundController._instance = new BackgroundController();
        }

        return BackgroundController._instance;
    }

    public run = async () => {
        this._NewWorldGameListener.start();
        // Decide whether to start the in-game or desktop window when running
        const running = await this.isNewWorldRunning();
        const alwaysLaunchDesktop = load('alwaysLaunchDesktop');

        if (!running) {
            await this.openWindow('desktop');
        } else {
            if (alwaysLaunchDesktop) {
                await this.openWindow('desktop');
            }
            // Always launch the in-game window in this branch, otherwise
            // no windows would be displayed.
            await this.openWindow('inGame');
        }
    }

    public async openWindow(window: ConcreteWindow) {
        if (this._openWindows.has(window)) {
            const windowState = await this._windows[window].getWindowState();
            if (windowState.window_state && bringToFrontWindowStates.includes(windowState.window_state)) {
                overwolf.windows.obtainDeclaredWindow(window, wnd => {
                    if (wnd.success) {
                        overwolf.windows.bringToFront(wnd.window.id, () => { /* Ignore the result of bringToFront */ });
                    } else {
                        this._windows[window].restore();
                    }
                });
            } else {
                this._windows[window].restore();
            }
        } else {
            this._windows[window].restore();
        }

        this._openWindows.add(window);
    }

    public closeWindow(window: ConcreteWindow) {
        this._openWindows.delete(window);
        this._windows[window].close();

        this.exitIfNoWindowsOpen();
    }

    private onGameStarted = async (info: RunningGameInfo) => {
        if (!info || !this.isGameNewWorld(info)) {
            return;
        }

        if (load('autoLaunchInGame')) {
            this.openWindow('inGame');
        }
    };

    private onGameEnded = async (info: RunningGameInfo) => {
        if (!info || !this.isGameNewWorld(info)) {
            return;
        }

        this.closeWindow('inGame');

    };

    private async isNewWorldRunning(): Promise<boolean> {
        const info = await OWGames.getRunningGameInfo();
        return info && info.isRunning && this.isGameNewWorld(info);
    }

    private isGameNewWorld = (info: RunningGameInfo) => {
        return info.classId === newWorldId;
    }

    private exitIfNoWindowsOpen = () => {
        if (this._openWindows.size === 0) {
            this._windows.background.close();
        }
    }
}

export function getBackgroundController() {
    // Each window has its own BackgroundController, due to how modules are loaded with webpack
    // Make sure to get the instance from the background window, as that is the one with the correct state
    return (overwolf.windows.getMainWindow().window as BackgroundControllerWindow).backgroundController;
}

if (BackgroundController.isSupported) {
    BackgroundController.instance.run();
    (window as BackgroundControllerWindow).backgroundController = BackgroundController.instance;
}
