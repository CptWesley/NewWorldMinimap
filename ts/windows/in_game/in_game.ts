import { AppWindow } from "../AppWindow";
import { OWGamesEvents } from "../../odk-ts/ow-games-events";
import { OWHotkeys } from "../../odk-ts/ow-hotkeys";
import { interestingFeatures, hotkeys, windowNames } from "../../consts";
import WindowState = overwolf.windows.WindowState;

// The window displayed in-game while a LoL game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
  private static _instance: InGame;
  private lolGameEventsListener: OWGamesEvents;
  private eventsLog: HTMLElement;
  private infoLog: HTMLElement;

  private constructor() {
    super(windowNames.inGame);

    this.eventsLog = document.getElementById('eventsLog');
    this.infoLog = document.getElementById('infoLog');

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();

    this.lolGameEventsListener = new OWGamesEvents({
      onInfoUpdates: this.onInfoUpdates.bind(this),
      onNewEvents: this.onNewEvents.bind(this)
    },
      interestingFeatures);
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public run() {
    this.lolGameEventsListener.start();
  }

  private onInfoUpdates(info) {
    this.logLine(this.infoLog, info, false);
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    const shouldHighlight = e.events.some(event => {
      return event.name === 'kill' ||
             event.name === 'death' ||
             event.name === 'assist' ||
             event.name === 'level'
    });
    this.logLine(this.eventsLog, e, shouldHighlight);
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const hotkeyText = await OWHotkeys.getHotkeyText(hotkeys.toggle);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async hotkeyResult => {
      console.log(`pressed hotkey for ${hotkeyResult.featureId}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
          inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
                 inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }

    OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    console.log(`${log.id}:`);
    console.log(data);
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    const shouldAutoScroll = (log.scrollTop + log.offsetHeight) > (log.scrollHeight - 10);

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }
}

InGame.instance().run();