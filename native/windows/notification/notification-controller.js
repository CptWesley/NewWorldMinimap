define([
  '../../windows/notification/notification-view.js'
], function (NotificationView) {

  class NotificationController {
    constructor() {
      this._notificationView = new NotificationView();

      this._notificationView.addCloseClickedListener(() => {
        window.close();
      })

      this._notificationListener = this._notificationListener.bind(this);
    }

    run() {
      // Listen to background to know what to display
      let mainWindow = overwolf.windows.getMainWindow();
      mainWindow.ow_eventBus.addListener(this._notificationListener);
    }

    _notificationListener(event, data) {
      if (event === "notification") {
        const seconds = data.time;
        this._notificationView.setTitle(data.title);
        this._notificationView.setMessage(data.message);
        this._notificationView.startTimer(seconds);
        setTimeout(window.close, seconds * 1000);
      }
    }
  }

  return NotificationController;
});