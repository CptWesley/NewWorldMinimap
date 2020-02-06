import { Timer } from "./timer";

export interface IOWGamesEventsDelegate {
  onInfoUpdates(info: any);
  onNewEvents(e: any);
}

export class OWGamesEvents {
  private _delegate: IOWGamesEventsDelegate;
  private _featureRetries: number;
  private _requiredFeatures: string[];

  constructor(delegate: IOWGamesEventsDelegate, 
              requiredFeatures: string[], 
              featureRetries: number = 10) {
    this._delegate = delegate;
    this._requiredFeatures = requiredFeatures;
    this._featureRetries = featureRetries;
  }

  public async getInfo(): Promise<any> {
    return new Promise((resolve) => {
      overwolf.games.events.getInfo(resolve);
    })
  }

  private async setRequiredFeatures(): Promise<boolean> {
    let tries:number = 1,
        result;

    while ( tries <= this._featureRetries ) {
      result = await new Promise(resolve => {
        overwolf.games.events.setRequiredFeatures(
          this._requiredFeatures,
          resolve
        );
      })

      if ( result.status === 'success' ) {
        console.log('setRequiredFeatures(): success: '+ JSON.stringify(result, null, 2));
        return (result.supportedFeatures.length > 0);
      }

      await Timer.wait(3000);
      tries++;
    }

    console.warn('setRequiredFeatures(): failure after '+ tries +' tries'+ JSON.stringify(result, null, 2));
    return false;
  }

  private registerEvents(): void {
    this.unRegisterEvents();

    overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
    overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
  }

  private unRegisterEvents(): void {
    overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
    overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
  }

  private onInfoUpdates = (info: any): void => {
    this._delegate.onInfoUpdates(info.info);
  }

  private onNewEvents = (e: any): void => {
    this._delegate.onNewEvents(e);
  }

  public async start(): Promise<void> {
    console.log(`[ow-game-events] START`);

    this.registerEvents();
    await this.setRequiredFeatures();

    const { res, status } = await this.getInfo();

    if ( res && status === 'success' ) {
      this.onInfoUpdates({ info: res });
    }
  }

  public stop(): void {
    console.log(`[ow-game-events] STOP`);

    this.unRegisterEvents();
  }
}
