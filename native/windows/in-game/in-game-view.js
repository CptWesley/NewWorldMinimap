define([
	'../../scripts/constants/window-names.js',
  '../../scripts/services/windows-service.js',
	'../../scripts/services/drag-service.js',
], function (WindowNames,
						 windowsService,
						 DragService) {
	const img = document.querySelector('img');
	const closeButton = document.getElementById('closeButton');
	const settingsButton = document.getElementById('settingsButton');
	const header = document.getElementsByClassName('app-header')[0];

	let dragService = null;

	closeButton.addEventListener('click', onCloseClicked);
	settingsButton.addEventListener('click', onSettingsClicked);
	overwolf.windows.getCurrentWindow(result => {
		dragService = new DragService(result.window, header);
	});

	function onCloseClicked(event) {
		windowsService.minimize(WindowNames.IN_GAME)
	}

	function onSettingsClicked(event) {
		windowsService.restore(WindowNames.SETTINGS)
	}

  function updateScreenshot(url) {
    img.src = url;
  }

  return {
    updateScreenshot
  }
});