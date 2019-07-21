define([
	'../../scripts/constants/window-names.js',
  '../../scripts/services/windows-service.js',
	'../../scripts/services/drag-service.js',
], function (WindowNames,
						 windowsService,
						 DragService) {
	const img = document.querySelector('img');
	const closeButton = document.getElementById('closeButton');
	const header = document.getElementsByClassName('app-header')[0];

	let dragService = null;

	closeButton.addEventListener('click', onCloseClicked);
	desktopButton.addEventListener('click', onDesktopClicked);
	overwolf.windows.getCurrentWindow(result => {
		dragService = new DragService(result.window, header);
	});

	function onCloseClicked(event) {
		// windowsService.minimize(WindowNames.IN_GAME)
	}

  return {
  }
});