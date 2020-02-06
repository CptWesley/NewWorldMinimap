import { OWListener, OWListenerDelegate } from "./ow-listener";

export interface OWGameListenerDelegate extends OWListenerDelegate {
  onGameStarted?(info: overwolf.games.RunningGameInfo);
  onGameEnded?(info: overwolf.games.RunningGameInfo);
}

export class OWGameListener extends OWListener<OWGameListenerDelegate> {
  constructor(delegate: OWGameListenerDelegate) {
    super(delegate);
  }

  public start(): void {
    super.start();

    overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
    overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
  }

  public stop(): void {
    overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
  }

  private onGameInfoUpdated = (update: overwolf.games.GameInfoUpdatedEvent): void => {
    if (!update || !update.gameInfo) {
      return;
    }

    if (!update.runningChanged && !update.gameChanged) {
      return;
    }

    if (update.gameInfo.isRunning) {
      if (this._delegate.onGameStarted) {
        this._delegate.onGameStarted(update.gameInfo)
      }
    } else {
      if (this._delegate.onGameEnded) {
        this._delegate.onGameEnded(update.gameInfo)
      }
    }
  }

  private onRunningGameInfo = (info: overwolf.games.RunningGameInfo): void => {
    if (!info) {
      return;
    }
    
    if (info.isRunning) {
      if (this._delegate.onGameStarted) {
        this._delegate.onGameStarted(info)
      }
    }
  }  
}