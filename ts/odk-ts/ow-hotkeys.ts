export class OWHotkeys {

  private constructor() { }

  public static getHotkeyText(hotkeyId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      overwolf.settings.getHotKey(hotkeyId, result => {
        if (!result || !result.success || !result.hotkey) {
          resolve('UNASSIGNED');
        }

        resolve(result.hotkey);
      });
    });
  }

  public static onHotkeyDown(hotkeyId: string, action: (hotkeyResult: overwolf.settings.HotKeyResult) => void): void {
    overwolf.settings.registerHotKey(hotkeyId, action);
  }
}