define(function () {
  let _listeners = [];

  function addListener(eventHandler) {
    _listeners.push(eventHandler);
  }

  function trigger(eventName, data) {
    for (let listener of _listeners) {
      listener(eventName, data);
    }
  }

  return {
    addListener,
    trigger
  }
});