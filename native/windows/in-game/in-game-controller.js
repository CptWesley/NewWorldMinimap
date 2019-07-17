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
             inGameView) {

  class InGameController {

    static run() {
      // listen to events from the event bus from the main window,
      // the callback will be run in the context of the current window
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.ow_eventBus.addListener(InGameController._eventListener);
    }

    static _eventListener(eventName, data) {
      switch (eventName) {
        case 'screenshot': {
          InGameController._updateScreenshot(data);
          break;
        }
        default:
          break;
      }
    }

    static _updateScreenshot(url) {
      inGameView.updateScreenshot(url);
      windowsService.restore(WindowNames.IN_GAME);
    }
  }


  return InGameController;
});
