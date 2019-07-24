define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/launch-source-service.js',
  '../../scripts/services/running-game-service.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/hotkeys-service.js',
  '../../windows/in-game/in-game-view.js'
], function (WindowNames,
             launchSourceService,
             runningGameService,
             windowsService,
             hotkeysService,
             InGameView) {

  class InGameController {

    constructor() {
      this.inGameView = new InGameView();

      this._gameEventHandler = this._gameEventHandler.bind(this);
      this._infoUpdateHandler = this._infoUpdateHandler.bind(this);
      this._eventListener = this._eventListener.bind(this);
    }

    run() {
      // listen to events from the event bus from the main window,
      // the callback will be run in the context of the current window
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.ow_eventBus.addListener(this._eventListener);
    }

    _eventListener(eventName, data) {
      switch (eventName) {
        case 'event': {
          this._gameEventHandler(data);
          break;
        }
        case 'info': {
          this._infoUpdateHandler(data);
          break;
        }
      }
    }

    // Logs events
    _gameEventHandler(event) {
      let isHightlight = false;
      switch (event.name) {
        case 'kill':
        case 'death':
        case 'matchStart':
        case 'matchEnd':
          isHightlight = true;
      }
      this.inGameView.logEvent(JSON.stringify(event), isHightlight);
    }

    // Logs info updates
    _infoUpdateHandler(infoUpdate) {
      this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), false);
    }
  }


  return InGameController;
});
