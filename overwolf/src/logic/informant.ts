import { newWorldId } from '@/OverwolfWindows/consts';
import { OWGameListener } from '@overwolf/overwolf-api-ts/dist';
import AppPlatform from './platform';
import UnloadingEvent from './unloadingEvent';

type GameRunningEventListener = (gameRunning: boolean) => void;

export class Informant {
    private _gameRunning = false;
    private _gameRunningEvent = new UnloadingEvent<GameRunningEventListener>('gameRunning');

    constructor() {
        this.listenForGameRunning();

        if (!NWMM_APP_BUILD_PRODUCTION) {
            this.debug_setGameRunning = (running: boolean) => {
                this._gameRunning = running;
                this._gameRunningEvent.fire(running);
            };
        }
    }

    public get gameRunning() {
        return this._gameRunning;
    }

    public debug_setGameRunning = (running: boolean) => {
        console.log(`Attempted to set gameRunning to ${running}, but this was a no-op.`);
    }

    public listenOnGameRunningChange = this._gameRunningEvent.register;

    private listenForGameRunning() {
        if (AppPlatform.isOverwolfApp()) {
            const owGameListener = new OWGameListener({
                onGameStarted: e => {
                    if (this.isGameNewWorld(e)) {
                        this._gameRunning = true;
                        this._gameRunningEvent.fire(true);
                    }
                },
                onGameEnded: e => {
                    if (this.isGameNewWorld(e)) {
                        this._gameRunning = false;
                        this._gameRunningEvent.fire(false);
                    }
                },
            });
            owGameListener.start();
        }
    }

    private isGameNewWorld = (info: overwolf.games.RunningGameInfo) => {
        return info.classId === newWorldId;
    }
}
