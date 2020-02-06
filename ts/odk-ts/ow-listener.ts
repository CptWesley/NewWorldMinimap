export interface OWListenerDelegate {
}

export abstract class OWListener<T extends OWListenerDelegate> {
  protected _delegate: T;

  constructor(delegate: T) {
    this._delegate = delegate;
  }

  public start(): void {
    this.stop();
  }

  abstract stop(): void;
}
