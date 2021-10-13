define([
  '../../windows/desktop/desktop-view.js'
], function (DesktopView) {

  class DesktopController {
    constructor() {
      this.desktopView = new DesktopView();
    }

    run() {
    }
  }

  return DesktopController;
});
