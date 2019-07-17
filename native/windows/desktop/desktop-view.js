define([
  '../../scripts/constants/window-names.js',
  '../../scripts/services/windows-service.js',
  '../../scripts/services/drag-service.js',
  '../../scripts/services/running-game-service.js',
], function (WindowNames,
             windowsService,
             DragService,
             runningGameService) {
  const toggleDiv = document.getElementById('toggle');
	const screenshotDiv = document.getElementById('screenshot');
	const closeButton = document.getElementById('closeButton');
	const header = document.getElementsByClassName('app-header')[0];
	
	closeButton.addEventListener('click', onCloseClicked);

  let dragService = null;
  overwolf.windows.getCurrentWindow(result => {
    dragService = new DragService(result.window, header);
  });

	async function onCloseClicked(event) {
    let isGameRunning = await runningGameService.isGameRunning();
    if (isGameRunning) {
		  window.close();
    } else {
      // let mainWindow = overwolf.windows.getMainWindow();
      // mainWindow.close();
      window.close();
    }
	}

  function updateToggle(value) {
    toggleDiv.textContent = value;
  }

  function updateScreenshot(value) {
    screenshotDiv.textContent = value;
  }

  return {
    updateScreenshot,
    updateToggle
  }
});