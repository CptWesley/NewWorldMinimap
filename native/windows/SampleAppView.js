define(["../scripts/services/drag-service.js"], function(DragService) {
  class SampleAppView {
    constructor() {
      // Background window:
      this._backgroundWindow = overwolf.windows.getMainWindow();
      // Page elements:
      this._closeButton = document.getElementById("closeButton");
      this._minimizeButton = document.getElementById("minimizeButton");
      this._header = document.getElementsByClassName("app-header")[0];
      this._version = document.getElementById("version");
      // Inittialize
      this.init();
    }

    init() {
      // Close app on X button click
      this._closeButton.addEventListener("click", () => {
        this._backgroundWindow.close();
      });
      // Listen to minimize click
      this._minimizeButton.addEventListener("click", () => {
        this._backgroundWindow.minimize();
      });
      // Enable dragging on this window
      overwolf.windows.getCurrentWindow(result => {
        this.dragService = new DragService(result.window, this._header);
      });
      // Display version
      overwolf.extensions.current.getManifest(manifest => {
        if (!this._version) {
          return;
        }
        this._version.textContent = `Version ${manifest.meta.version}`;
      });
    }
  }

  return SampleAppView;
});
