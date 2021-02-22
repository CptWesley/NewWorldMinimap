export class OWHotkeys {

  private constructor() { }

  public static getHotkeyText(hotkeyId: string, gameId?: number): Promise<string> {
    return new Promise(resolve => {
      overwolf.settings.hotkeys.get(result => {
        if ( result && result.success ) {
          let hotkey:overwolf.settings.hotkeys.IHotkey

          if ( gameId === undefined )
            hotkey = result.globals.find(h => h.name === hotkeyId)
          else if ( result.games && result.games[gameId] )
            hotkey = result.games[gameId].find(h => h.name === hotkeyId)

          if ( hotkey )
            return resolve(hotkey.binding)
        }

        resolve('UNASSIGNED');
      });
    });
  }

  public static onHotkeyDown(hotkeyId: string, action: (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent) => void): void {
    overwolf.settings.hotkeys.onPressed.addListener((result: overwolf.settings.hotkeys.OnPressedEvent): void => {
      if ( result && result.name === hotkeyId )
        action(result)
    });
  }
}
