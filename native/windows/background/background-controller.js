define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/running-game-service.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/hotkeys-service.js',
  '../../scripts/services/gep-service.js',
  '../../scripts/services/event-bus.js'
], function (WindowNames,
             runningGameService,
             WindowsService,
             hotkeysService,
             gepService,
             eventBus) {

  class BackgroundController {
    static async run() {
      // this will be available when calling overwolf.windows.getMainWindow()
      window.ow_eventBus = eventBus;
      window.minimize = BackgroundController.minimize;

      // Handle what happens when the app is launched while already running
      // (relaunch)
      BackgroundController._registerAppLaunchTriggerHandler();
      // Register handlers to hotkey events
      BackgroundController._registerHotkeys();

      let isGameRunning = await runningGameService.isGameRunning();

      // Obtain windows and set their sizes:
      // Desktop:
      const desktopWindowName = await WindowsService.getStartupWindowName();
      const desktopWindow = await WindowsService.obtainWindow(desktopWindowName);
      await WindowsService.changeSize(desktopWindow.window.id, 1200, 659);
      // In-Game:
      const inGameWindow = await WindowsService.obtainWindow(WindowNames.IN_GAME);
      await WindowsService.changeSize(inGameWindow.window.id, 1641, 692);


      if (!isGameRunning) {
        WindowsService.restore(desktopWindowName);
      }
      else {
        gepService.registerToGEP();
        await WindowsService.restore(WindowNames.IN_GAME);
        WindowsService.minimize(WindowNames.IN_GAME);
      }

      runningGameService.addGameRunningChangedListener((isGameRunning) => {
        if (isGameRunning) {
          // Close desktop window
          WindowsService.close(WindowNames.DESKTOP);
          // Open in-game window
          WindowsService.restore(WindowNames.IN_GAME);
        } else {
          // Close in-game window
          WindowsService.close(WindowNames.IN_GAME);
          // Open desktop window
          WindowsService.restore(WindowNames.DESKTOP);
        }
      });
    }

    /**
     * Minimize all app windows
     * @public
     */
    static async minimize() {
      const openWindows = await WindowsService.getOpenWindows();
      for (let windowName in openWindows) {
        await WindowsService.minimize(windowName);
      }
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
      WindowsService.restore(WindowNames.DESKTOP);
    }

    /**
     * set custom hotkey behavior
     * @private
     */
    static _registerHotkeys() {
      hotkeysService.setToggleHotkey(async () => {
        let state = await WindowsService.getWindowState(WindowNames.IN_GAME);
        if ((state === 'minimized') || (state === 'closed')) {
          WindowsService.restore(WindowNames.IN_GAME)
        } else if ((state === 'normal') || (state === 'maximized')) {
          WindowsService.minimize(WindowNames.IN_GAME)
        }
      });
    }
  }


  return BackgroundController;
});
