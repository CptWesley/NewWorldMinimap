define([
  '',
], function () {

  class NotificationView {
    constructor() {
      this._circle = document.getElementById('circle');
      this._title = document.getElementById('title');
      this._message = document.getElementById('text');
      this._countdown = document.getElementById('countdown');
      this._closeButton = document.getElementById('closeButton');

      this.startTimer = this.startTimer.bind(this);
      this.setTitle = this.setTitle.bind(this);
      this.setMessage = this.setMessage.bind(this);
      this.addCloseClickedListener = this.addCloseClickedListener.bind(this);
    }

    setTitle(title) {
      this._title.textContent = title;
    }

    setMessage(message) {
      this._message.textContent = message;
    }

    startTimer(time) {
      console.log('Starting notification timer...');
      this._circle.style.animation = `countdown ${time}s linear 1 forwards`;
    }

    addCloseClickedListener(listener) {
      this._countdown.addEventListener('click', listener);
      this._closeButton.addEventListener('click', listener);
    }
  }

  return NotificationView;
});