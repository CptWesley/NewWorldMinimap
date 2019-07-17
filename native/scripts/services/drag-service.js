define(function () {
  const SIGNIFICANT_MOUSE_MOVE_THRESHOLD = 1;

  class DragService {
    constructor(currentWindow, element) {
      this.currentWindow = currentWindow;
      this.initialMousePosition = 0;
      this.isMouseDown = false;

      element.addEventListener('mousedown', this.onDragStart.bind(this));
      element.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    /**
     * check that the mouse is moved in a significant distance to prevent
     * unnecessary calls for dragMove
     * @param event mouse event
     * @returns {boolean}
     * @private
     */
    _isSignificantMouseMove(event) {
      if (!this.initialMousePosition) {
        return false;
      }

      let x = event.clientX;
      let y = event.clientY;
      let diffX = Math.abs(x - this.initialMousePosition.x);
      let diffY = Math.abs(y - this.initialMousePosition.y);
      let isSignificant =
        (diffX > SIGNIFICANT_MOUSE_MOVE_THRESHOLD) ||
        (diffY > SIGNIFICANT_MOUSE_MOVE_THRESHOLD);

      return isSignificant;
    }

    onDragStart(event) {
      this.isMouseDown = true;
      this.initialMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }

    onMouseMove(event) {
      if (!this.isMouseDown) {
        return;
      }

      let isSignificantMove = this._isSignificantMouseMove(event);
      if (!isSignificantMove) {
        return;
      }

      this.isMouseDown = false;

      if (this.currentWindow) {
        overwolf.windows.dragMove(this.currentWindow.id);
      }
    }
  }

  return DragService;
});