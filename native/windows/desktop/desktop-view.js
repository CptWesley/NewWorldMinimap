define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/drag-service.js',
  '../../scripts/services/running-game-service.js',
], function (WindowNames,
             windowsService,
             DragService,
             runningGameService) {

  class DesktopView {
    static run() {
      const closeButton = document.getElementById('closeButton');
      const header = document.getElementsByClassName('app-header')[0];

      closeButton.addEventListener('click', DesktopView.onCloseClicked);

      let dragService = null;
      overwolf.windows.getCurrentWindow(result => {
        dragService = new DragService(result.window, header);
      });
    }

    static async onCloseClicked(event) {
      // Open 'close/minimize' dialog
      // let mainWindow = overwolf.windows.getMainWindow();
      // mainWindow.promptCloseMinimize();

      window.close();
    }
  }

  return DesktopView;
});