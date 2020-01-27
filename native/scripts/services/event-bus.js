define(function () {
  const _listeners = [];

  function addListener(eventHandler) {
    _listeners.push(eventHandler);
  }

  function trigger(eventName, data) {
    _listeners.forEach(listener => listener(eventName, data))
  }

  return {
    addListener,
    trigger
  }
});