define([
  "../../scripts/constants/window-names.js",
  "../../scripts/services/running-game-service.js",
  "../../scripts/services/windows-service.js",
  "../../scripts/services/hotkeys-service.js",
  "../../scripts/services/gep-service.js",
  "../../scripts/services/event-bus.js"
], function (
  WindowNames,
  runningGameService,
  WindowsService,
  hotkeysService,
  gepService,
  eventBus
) {
  class BackgroundController {
    static async run() {
      // this will be available when calling overwolf.windows.getMainWindow()
      window.ow_eventBus = eventBus;
      window.minimize = BackgroundController.minimize;

      // Register handlers to hotkey events
      BackgroundController._registerHotkeys();

      await BackgroundController._restoreLaunchWindow();

      // Switch between desktop/in-game windows when launching/closing game
      runningGameService.addGameRunningChangedListener(
        BackgroundController._onRunningGameChanged
      );

      overwolf.extensions.onAppLaunchTriggered.addListener(e => {
        if (e && e.source !== 'gamelaunchevent') {
          BackgroundController._restoreAppWindow();
        }
      });

      // Listen to changes in windows
      overwolf.windows.onStateChanged.addListener(async () => {
        // If there's only 1 window (background) open, close the app
        const openWindows = await WindowsService.getOpenWindows();
        if (Object.keys(openWindows).length <= 1) {
          window.close();
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
     * Handle game opening/closing
     * @private
     */
    static async _onRunningGameChanged(isGameRunning) {
      if (isGameRunning) {
        // Register to game events
        gepService.registerToGEP(
          BackgroundController.onGameEvents,
          BackgroundController.onInfoUpdate
        );
        // Open in-game window
        await WindowsService.restore(WindowNames.IN_GAME);
        // Close desktop window
        WindowsService.close(WindowNames.DESKTOP);
      } else {
        // Open desktop window
        await WindowsService.restore(WindowNames.DESKTOP);
        // Close in-game window
        WindowsService.close(WindowNames.IN_GAME);
      }
    }

    /**
     * Open the relevant window on app launch
     * @private
     */
    static async _restoreLaunchWindow() {
      const isGameRunning = await runningGameService.isGameRunning();

      if (!isGameRunning) {

        WindowsService.restore(WindowNames.DESKTOP);
      } else {
        gepService.registerToGEP(
          BackgroundController.onGameEvents,
          BackgroundController.onInfoUpdate
        );

        await WindowsService.restore(WindowNames.IN_GAME);

        if (BackgroundController._launchedWithGameEvent()) {
          WindowsService.minimize(WindowNames.IN_GAME);
        }
      }
    }

    /**
     * Open the relevant window on user request
     * @private
     */
    static async _restoreAppWindow() {
      const isGameRunning = await runningGameService.isGameRunning();

      if (isGameRunning) {
        WindowsService.restore(WindowNames.IN_GAME);
      } else {
        WindowsService.restore(WindowNames.DESKTOP);
      }
    }

    /**
     * app was launched with game launch
     * @private
     */
    static _launchedWithGameEvent() {
      return location.href.includes('source=gamelaunchevent');
    }

    /**
     * set custom hotkey behavior
     * @private
     */
    static _registerHotkeys() {
      hotkeysService.setToggleHotkey(async () => {
        const state = await WindowsService.getWindowState(WindowNames.IN_GAME);
        if (state === "minimized" || state === "closed") {
          WindowsService.restore(WindowNames.IN_GAME);
        } else if (state === "normal" || state === "maximized") {
          WindowsService.minimize(WindowNames.IN_GAME);
        }
      });
    }

    /**
     * Pass events to windows that are listening to them
     * @private
     */
    static onGameEvents(data) {
      data.events.forEach(event => {
        console.log(JSON.stringify(event));
        window.ow_eventBus.trigger("event", event);

        if (event.name === "matchStart") {
          WindowsService.restore(WindowNames.IN_GAME);
        }
      });
    }

    /**
     * Pass info updates to windows that are listening to them
     * @private
     */
    static onInfoUpdate(data) {
      window.ow_eventBus.trigger("info", data);
    }
  }

  return BackgroundController;
});
