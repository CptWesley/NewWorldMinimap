/**
 * Detect whether a game is currently running
 */
define(function () {

  let _gameRunningChangedListeners = [];

  function _init() {
    overwolf.games.onGameInfoUpdated.removeListener(_onGameInfoUpdated);
    overwolf.games.onGameInfoUpdated.addListener(_onGameInfoUpdated);
  }

  /**
   * A game info was updated (running state, or other state changed such as
   * resolution changed)
   * @param event
   * @private
   */
  function _onGameInfoUpdated(event) {
    let gameRunning;

    if (event &&
      (event.runningChanged || event.gameChanged)) {
      gameRunning = (event.gameInfo && event.gameInfo.isRunning);
      for (let listener of _gameRunningChangedListeners) {
        listener(gameRunning);
      }
    }
  }

  async function isGameRunning() {
    let gameRunning = await _isGameRunning();
    return gameRunning;
  }

  function _isGameRunning() {
    return new Promise((resolve => {
      // get the current running game info if any game is running
      overwolf.games.getRunningGameInfo(function (runningGameInfo) {
        if (runningGameInfo && runningGameInfo.isRunning) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }));
  }
  
  function addGameRunningChangedListener(callback) {
    _gameRunningChangedListeners.push(callback);
  }

  _init();

  return {
    isGameRunning,
    addGameRunningChangedListener
  }
});