define([
  '../scripts/services/drag-service.js',
], function (DragService) {

  class InGameView {
    constructor() {
      // Methods:
      this.showExitMinimizeModal = this.showExitMinimizeModal.bind(this);
      this.hideExitMinimizeModal = this.hideExitMinimizeModal.bind(this);
      // Background window:
      this.backgroundWindow = overwolf.windows.getMainWindow();
      // Page elements:
      this.modal = document.getElementById("exitMinimizeModal");
      this.closeButton = document.getElementById('closeButton');
      this.exitButton = document.getElementById("exit");
      this.minimizeButton = document.getElementById("minimize");
      this.header = document.getElementsByClassName('app-header')[0];
      // Inittialize
      this.init();
    }

    init() {
      // Listen to X button click
      this.closeButton.addEventListener('click', this.showExitMinimizeModal);
      // Close app on exit click
      this.exitButton.addEventListener('click', () => {
        this.backgroundWindow.close();
      });
      // Minimize app on minimize click
      this.minimizeButton.addEventListener('click', () => {
        this.backgroundWindow.minimize();
        this.hideExitMinimizeModal();
      });
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = (function(event) {
        if (event.target == this.modal) {
          this.hideExitMinimizeModal();
        }
      }).bind(this);
      // Enable dragging on this window
      overwolf.windows.getCurrentWindow(result => {
        this.dragService = new DragService(result.window, this.header);
      });
    }

    showExitMinimizeModal() {
      this.modal.style.display = "block";
    }

    hideExitMinimizeModal() {
      this.modal.style.display = "none";
    }
  }

  return InGameView;
});