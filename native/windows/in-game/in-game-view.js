define(["../SampleAppView.js"], function(SampleAppView) {
  class InGameView extends SampleAppView {
    constructor() {
      super();

      this._eventsLog = document.getElementById("eventsLog");
      this._infoLog = document.getElementById("infoLog");
      this._copyEventsButton = document.getElementById("copyEvents");
      this._copyInfoButton = document.getElementById("copyInfo");
      this._hotkey = document.getElementById("hotkey");

      this.logEvent = this.logEvent.bind(this);
      this.logInfoUpdate = this.logInfoUpdate.bind(this);
      this.updateHotkey = this.updateHotkey.bind(this);
      this._copyEventsLog = this._copyEventsLog.bind(this);
      this._copyInfoLog = this._copyInfoLog.bind(this);

      this._copyEventsButton.addEventListener("click", this._copyEventsLog);
      this._copyInfoButton.addEventListener("click", this._copyInfoLog);
    }

    // -- Public --

    // Add a line to the events log
    logEvent(string, isHighlight) {
      this._logLine(this._eventsLog, string, isHighlight);
    }
    // Add a line to the info updates log
    logInfoUpdate(string, isHighlight) {
      this._logLine(this._infoLog, string, isHighlight);
    }

    // Update hotkey header
    updateHotkey(hotkey) {
      this._hotkey.textContent = hotkey;
    }

    // -- Private --

    _copyEventsLog() {
      this._copyLog(this._eventsLog);
    }

    _copyInfoLog() {
      this._copyLog(this._infoLog);
    }

    // Copy text from log
    _copyLog(log) {
      // Get text from all span children
      const nodes = log.childNodes;
      let text = "";
      for (let node of nodes) {
        if (node.tagName === "P") {
          text += node.innerText + "\n";
        }
      }

      // Create temporary textarea to copy to clipboard from
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    // Add a line to a log
    _logLine(log, string, isHighlight) {
      const line = document.createElement("p");
      // Check if scroll is near bottom
      const autoScrollOn =
        log.scrollTop + log.offsetHeight > log.scrollHeight - 10;

      if (isHighlight) {
        line.className = "highlight";
      }

      line.textContent = string;

      log.appendChild(line);

      if (autoScrollOn) {
        log.scrollTop = log.scrollHeight;
      }
    }
  }

  return InGameView;
});
