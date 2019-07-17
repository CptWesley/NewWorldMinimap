define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/launch-source-service.js',
  '../../scripts/services/running-game-service.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/hotkeys-service.js',
  '../../windows/settings/settings-view.js'
], function (WindowNames,
             launchSourceService,
             runningGameService,
             windowsService,
             hotkeysService,
             settingsView) {

  class SettingsController {
    static async run() {
      try {
        await SettingsController._updateHotkeys();
      } catch (e) {
        console.error(e);
      }

      hotkeysService.addHotkeyChangeListener(SettingsController._updateHotkeys);
    }

    static async _updateHotkeys() {
      let toggleHotkey = await hotkeysService.getToggleHotkey();
      let screenshotHotkey = await hotkeysService.getTakeScreenshotHotkey();
      settingsView.updateToggle(toggleHotkey);
      settingsView.updateScreenshot(screenshotHotkey);
    }
  }

  return SettingsController;
});
