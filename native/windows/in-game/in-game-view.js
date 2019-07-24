define([
  '../SampleAppView.js'
], function (SampleAppView) {

  class InGameView extends SampleAppView {
    constructor() {
      super();

      this.eventsLog = document.getElementById('eventsLog');
      this.infoLog = document.getElementById('infoLog');
      this.copyEventsButton = document.getElementById('copyEvents');
      this.copyInfoButton = document.getElementById('copyInfo');

      this.logEvent = this.logEvent.bind(this);
      this.logInfoUpdate = this.logInfoUpdate.bind(this);
      this.copyEventsLog = this._copyEventsLog.bind(this);
      this.copyInfoLog = this._copyInfoLog.bind(this);

      this.copyEventsButton.addEventListener('click', this._copyEventsLog);
      this.copyInfoButton.addEventListener('click', this._copyInfoLog);
    }

    // -- Public --

    // Add a line to the events log
    logEvent(string, isHighlight) {
      this._logLine(this.eventsLog, string, isHighlight);
    }
    // Add a line to the info updates log
    logInfoUpdate(string, isHighlight) {
      this._logLine(this.infoLog, string, isHighlight);
    }

    // -- Private --

    _copyEventsLog() {
      this._copyLog(this.eventsLog);
    }

    _copyInfoLog() {
      this._copyLog(this.infoLog);
    }

    // Copy text from log
    _copyLog(log) {
      // Get text from all span children
      const nodes = log.childNodes;
      let text = '';
      for (let node of nodes) {
        if (node.tagName === 'SPAN') {
          text += node.textContent + '\n';
        }
      }

      // Create temporary textarea to copy to clipboard from
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
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