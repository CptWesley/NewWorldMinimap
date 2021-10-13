import { OWGameListener, OWGames, OWWindow } from '@overwolf/overwolf-api-ts';
import { BackgroundWindow, ConcreteWindow, newWorldId, windowNames } from '../consts';

import RunningGameInfo = overwolf.games.RunningGameInfo;

export type BackgroundControllerWindow = typeof window & {
    backgroundController: BackgroundController;
}

type GameRunningEventListener = (gameRunning: boolean) => void;

export class BackgroundController {
    private static _instance: BackgroundController;
    private _windows: Record<BackgroundWindow | ConcreteWindow, OWWindow>;
    private _openWindows = new Set<ConcreteWindow>();
    private _NewWorldGameListener: OWGameListener;
    private _gameRunning = false;
    private _gameRunningEventListeners = new Set<GameRunningEventListener>();

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

    // Implementing the Singleton design pattern
    public static get instance(): BackgroundController {
        if (!BackgroundController._instance) {
            BackgroundController._instance = new BackgroundController();
        }

        return BackgroundController._instance;
    }

    public get gameRunning() {
        return this._gameRunning;
    }

    public run = async () => {
        this._NewWorldGameListener.start();
        // Decide whether to start the in-game or desktop window when running
        const currWindow = await this.isNewWorldRunning()
            ? windowNames.inGame
            : windowNames.desktop;
        this._windows[currWindow].restore();
    }

    public openWindow(window: ConcreteWindow) {
        if (this._openWindows.has(window)) {
            overwolf.windows.obtainDeclaredWindow(window, wnd => {
                if (wnd.success) {
                    overwolf.windows.bringToFront(wnd.window.id, () => { /* Ignore the result of bringToFront */ });
                }
            });
        } else {
            this._windows[window].restore();
        }

        this._openWindows.add(window);
    }

    public closeWindow(window: ConcreteWindow) {
        this._openWindows.delete(window);
        this._windows[window].close();

        if (this._openWindows.size === 0) {
            this._windows.background.close();
        }
    }

    public listenOnGameRunningChange = (listener: GameRunningEventListener) => {
        this._gameRunningEventListeners.add(listener);
        return () => {
            this._gameRunningEventListeners.delete(listener);
        };
    }

    private onGameStarted = async (info: RunningGameInfo) => {
        if (!info || !this.isGameNewWorld(info)) {
            return;
        }

        this._gameRunning = true;
        this.openWindow('inGame');
        this._gameRunningEventListeners.forEach(l => l(true));
    };

    private onGameEnded = async (info: RunningGameInfo) => {
        if (!info || !this.isGameNewWorld(info)) {
            return;
        }

        this._gameRunning = false;
        this.closeWindow('inGame');
        this._gameRunningEventListeners.forEach(l => l(false));
    };

    private async isNewWorldRunning(): Promise<boolean> {
        const info = await OWGames.getRunningGameInfo();
        return info && info.isRunning && this.isGameNewWorld(info);
    }

    private isGameNewWorld = (info: RunningGameInfo) => {
        return info.classId === newWorldId;
    }
}

BackgroundController.instance.run();
(window as BackgroundControllerWindow).backgroundController = BackgroundController.instance;
