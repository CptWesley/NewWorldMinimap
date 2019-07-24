define([
  '../SampleAppView.js'
], function (SampleAppView) {

  class InGameView extends SampleAppView {
    constructor() {
      super();

      this.eventsLog = document.getElementById('eventsLog');
      this.updatesLog = document.getElementById('updatesLog');

      this.logEvent = this.logEvent.bind(this);
      this.logInfoUpdate = this.logInfoUpdate.bind(this);
    }

    // Add a line to the events log
    logEvent(string, isHighlight) {
      this._logLine(this.eventsLog, string, isHighlight);
    }
    // Add a line to the info updates log
    logInfoUpdate(string, isHighlight) {
      this._logLine(this.updatesLog, string, isHighlight);
    }

    // Add a line to a log
    _logLine(log, string, isHighlight) {
      const span = document.createElement("span");
      const br = document.createElement("br");
      // Check if scroll is near bottom
      const autoScrollOn =
        (log.scrollTop + log.offsetHeight) > log.scrollHeight - 10;

      if (isHighlight) {
        span.className = 'highlight';
      }

      span.textContent = string;

      log.appendChild(span);
      log.appendChild(br);

      if (autoScrollOn) {
        log.scrollTop = log.scrollHeight;
      }
    }
  }

  return InGameView;
});