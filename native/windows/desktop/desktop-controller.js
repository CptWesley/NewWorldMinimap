define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/launch-source-service.js',
  '../../scripts/services/running-game-service.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/hotkeys-service.js',
  '../../windows/desktop/desktop-view.js'
], function (WindowNames,
             launchSourceService,
             runningGameService,
             windowsService,
             hotkeysService,
             DesktopView) {

  class DesktopController {
    static async run() {
      const desktopView = new DesktopView();
    }
  }

  return DesktopController;
});
