define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/running-game-service.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/hotkeys-service.js',
  '../../scripts/services/gep-service.js',
  '../../scripts/services/event-bus.js'
], function (WindowNames,
             runningGameService,
             windowsService,
             hotkeysService,
             gepService,
             eventBus) {

  class BackgroundController {
    static async run() {
      // this will be available when calling overwolf.windows.getMainWindow()
      window.ow_eventBus = eventBus;

      // Handle what happens when the app is launched while already running
      // (relaunch)
      BackgroundController._registerAppLaunchTriggerHandler();
      // Register handlers to hotkey events
      BackgroundController._registerHotkeys();

      let isGameRunning = await runningGameService.isGameRunning();

      if (!isGameRunning) {
        const desktopWindowName = await windowsService.getStartupWindowName();
        const desktopWindow = await windowsService.obtainWindow(desktopWindowName);
        await windowsService.changeSize(desktopWindow.window.id, 1200, 659);
        windowsService.restore(desktopWindowName);
      }
      else {
        gepService.registerToGEP();
        await windowsService.restore(WindowNames.IN_GAME);
        windowsService.minimize(WindowNames.IN_GAME);
      }

      runningGameService.addGameRunningChangedListener((isGameRunning) => {
        if (isGameRunning) {
          // Close desktop window
          // Open in-game window
          windowsService.restore(WindowNames.IN_GAME);
        } else {
          // Close in-game window
          // Open desktop window
        }
      });
    }

    /**
     * handles app launch trigger event - i.e dock icon clicked
     * @private
     */
    static _registerAppLaunchTriggerHandler() {
      overwolf.extensions.onAppLaunchTriggered.removeListener(
        BackgroundController._onAppRelaunch);
      overwolf.extensions.onAppLaunchTriggered.addListener(
        BackgroundController._onAppRelaunch);
    }

    static _onAppRelaunch() {
      windowsService.restore(WindowNames.DESKTOP);
    }

    /**
     * set custom hotkey behavior
     * @private
     */
    static _registerHotkeys() {
      // hotkeysService.setTakeScreenshotHotkey(async () => {
      //   try {
      //     let screenshotUrl = await screenshotService.takeScreenshot();
      //     window.ow_eventBus.trigger('screenshot', screenshotUrl);
      //   } catch (e) {
      //     console.error(e);
      //   }
      // });
    }
  }


  return BackgroundController;
});
