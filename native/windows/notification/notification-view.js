define([
  '',
], function () {

  class NotificationView {
    constructor() {
      this.circle = document.getElementById('circle');

      this.startTimer = this.startTimer.bind(this);
    }

    startTimer(time) {
      this.circle.style.animation = `countdown ${time}s linear 1 forwards`;
      console.log(this.circle.style.animation);
    }
  }

  return NotificationView;
});