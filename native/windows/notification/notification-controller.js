define([
  '../../windows/notification/notification-view.js'
], function (NotificationView) {

  class NotificationController {
    constructor() {
      this.notificationView = new NotificationView();

      this._notificationListener = this._notificationListener.bind(this);
    }

    run() {
      // Listen to background to know what to display
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.ow_eventBus.addListener(this._notificationListener);
    }

    _notificationListener(event, data) {
      switch (event) {
        case 'notification':

          break;
        case 'notification-time':
          this.notificationView.startTimer(data);
          break;
      }
    }
  }

  return NotificationController;
});