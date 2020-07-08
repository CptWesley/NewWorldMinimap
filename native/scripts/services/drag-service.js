define(function () {
  const SIGNIFICANT_MOUSE_MOVE_THRESHOLD = 1;

  class DragService {
    constructor(currentWindow, element) {
      this.currentWindow = currentWindow;
      this.initialMousePosition = 0;
      this.isMouseDown = false;

      element.addEventListener('mousedown', this.onDragStart.bind(this));
      element.addEventListener('mousemove', this.onMouseMove.bind(this));
      element.className = element.className + ' draggable';
    }

    /**
     * check that the mouse is moved a significant distance to prevent
     * unnecessary calls to dragMove
     * @param event mouse event
     * @returns {boolean}
     * @private
     */
    _isSignificantMouseMove(event) {
      if (!this.initialMousePosition) {
        return false;
      }

      const x = event.clientX;
      const y = event.clientY;
      const diffX = Math.abs(x - this.initialMousePosition.x);
      const diffY = Math.abs(y - this.initialMousePosition.y);
      return diffX > SIGNIFICANT_MOUSE_MOVE_THRESHOLD || diffY > SIGNIFICANT_MOUSE_MOVE_THRESHOLD;
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

      if (!this._isSignificantMouseMove(event)) {
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