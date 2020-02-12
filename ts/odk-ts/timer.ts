export interface TimerDelegate {
  onTimer(id?: string): void;
}

//------------------------------------------------------------------------------
export class Timer {
  //----------------------------------------------------------------------------
  private _timerId: number|null = null;
  private _id: string|undefined;
  private _delegate: TimerDelegate;

  //----------------------------------------------------------------------------
  public static async wait(intervalInMS: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(resolve, intervalInMS);
    })
  }

  //----------------------------------------------------------------------------
  constructor(delegate: TimerDelegate, id?: string) {
    this._delegate = delegate;
    this._id = id;
  }

  //----------------------------------------------------------------------------
  public start(intervalInMS: number): void {
    this.stop();

    //@ts-ignore
    this._timerId = <number>setTimeout(this.handleTimerEvent, intervalInMS);
  }

  //----------------------------------------------------------------------------
  public stop(): void {
    if (this._timerId == null) {
      return;
    }

    clearTimeout(this._timerId);
    this._timerId = null;
  }

  //----------------------------------------------------------------------------
  private handleTimerEvent = () => {
    this._timerId = null;
    this._delegate.onTimer(this._id);
  }
}
