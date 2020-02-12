type GetWindowStateResult = overwolf.windows.GetWindowStateResult;
type OwWindowInfo = overwolf.windows.WindowInfo;
export class OWWindow {
  private _name: string | null;
  private _id: string | null;

  constructor(name: string | null = null) {
    this._name = name;
    this._id = null;
  }

  public async restore(): Promise<void> {
    let that = this;

    return new Promise<void>(async (resolve) => {
      await that.assureObtained();
      let id: string = <string>that._id;
      overwolf.windows.restore(id, result => {
        if (!result.success)
          console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
        resolve();
      });
    })
  }

  public async minimize(): Promise<void> {
    let that = this;

    return new Promise<void>(async resolve => {
      await that.assureObtained();
      let id: string = <string>that._id;
      overwolf.windows.minimize(id, () => { });
      return resolve();
    })
  }

  public async maximize(): Promise<void> {
    let that = this;

    return new Promise<void>(async resolve => {
      await that.assureObtained();
      let id: string = <string>that._id;
      overwolf.windows.maximize(id, () => { });
      return resolve();
    })
  }

  public async hide(): Promise<void> {
    let that = this;

    return new Promise<void>(async resolve => {
      await that.assureObtained();
      let id: string = <string>that._id;
      overwolf.windows.hide(id, () => { });
      return resolve();
    })
  }

  public async close() {
    let that = this;

    return new Promise(async resolve => {
      await that.assureObtained();
      let id: string = <string>that._id;

      const result = await this.getWindowState();

      if (result.success &&
        (result.window_state !== 'closed')) {
        await this.internalClose();
      }

      return resolve();
    })
  }

  public dragMove(elem: HTMLElement) {
    elem.onmousedown = e => {
      e.preventDefault();
      overwolf.windows.dragMove(this._name);
    };
  }

  public async getWindowState(): Promise<GetWindowStateResult> {
    let that = this;

    return new Promise<GetWindowStateResult>(async resolve => {
      await that.assureObtained();
      let id: string = <string>that._id;
      overwolf.windows.getWindowState(id, resolve);
    })
  }

  public static async getCurrentInfo(): Promise<OwWindowInfo> {
    return new Promise<OwWindowInfo>(async resolve => {
      overwolf.windows.getCurrentWindow(result => {
        resolve(result.window);
      })
    })
  }

  private obtain(): Promise<OwWindowInfo | null> {
    return new Promise((resolve, reject) => {
      const cb = res => {
        if (res && res.status === "success" && res.window && res.window.id) {
          this._id = res.window.id;

          if (!this._name) {
            this._name = res.window.name;
          }

          resolve(res.window);
        } else {
          this._id = null;
          reject();
        }
      };

      if (!this._name) {
        overwolf.windows.getCurrentWindow(cb);
      } else {
        overwolf.windows.obtainDeclaredWindow(this._name, cb);
      }
    })
  }

  private async assureObtained(): Promise<void> {
    let that = this;
    return new Promise<void>(async resolve => {
      await that.obtain();
      return resolve();
    });
  }

  private async internalClose(): Promise<void> {
    let that = this;

    return new Promise<void>(async (resolve, reject) => {
      await that.assureObtained();
      let id: string = <string>that._id;

      overwolf.windows.close(id, res => {

        if (res && res.success)
          resolve();
        else
          reject(res);
      });
    })
  }
}
