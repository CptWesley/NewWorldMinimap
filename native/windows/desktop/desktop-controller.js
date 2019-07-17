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
             desktopView) {

  class DesktopController {
    static async run() {
      try {
        await DesktopController._updateHotkeys();
      } catch (e) {
        console.error(e);
      }

      hotkeysService.addHotkeyChangeListener(DesktopController._updateHotkeys);
    }

    static async _updateHotkeys() {
      let toggleHotkey = await hotkeysService.getToggleHotkey();
      let screenshotHotkey = await hotkeysService.getTakeScreenshotHotkey();
      desktopView.updateToggle(toggleHotkey);
      desktopView.updateScreenshot(screenshotHotkey);
    }
  }

  return DesktopController;
});
