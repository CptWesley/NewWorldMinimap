define([
  '../constants/window-names.js',
  '../services/launch-source-service.js',
  '../services/running-game-service.js',
], function (WindowNames,
             launchSourceService,
             runningGameService) {

  /**
   * obtain a window object by a name as declared in the manifest
   * this is required in order to create the window before calling other APIs
   * on that window
   * @param name
   * @returns {Promise<any>}
   * @private
   */
  function _obtainWindow(name) {
    return new Promise((resolve, reject) => {
      overwolf.windows.obtainDeclaredWindow(name, (response) => {
        if (response.status !== 'success') {
          return reject(response);
        }

        resolve(response);
      });
    });
  }

  function _getCurrentWindow() {
    return new Promise((resolve, reject) => {
      overwolf.windows.getCurrentWindow(result => {
        if (result.status === 'success') {
          resolve(result.window);
        } else {
          reject(result);
        }
      });
    });
  }

  /**
   * restore a window by name
   * @param name
   * @returns {Promise<any>}
   */
  function restore(name) {
    return new Promise(async (resolve, reject) => {
      try {
        await _obtainWindow(name);
        overwolf.windows.restore(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  /**
   * start dragging the current window
   * @param name
   * @returns {Promise<any>}
   */
  function dragMove(name) {
    return new Promise(async (resolve, reject) => {
      try {
        await _obtainWindow(name);
        let window = await _getCurrentWindow();
        overwolf.windows.dragMove(window.id, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * minimize a window by name
   * @param name
   * @returns {Promise<any>}
   */
  function minimize(name) {
    return new Promise(async (resolve, reject) => {
      try {
        await _obtainWindow(name);
        overwolf.windows.minimize(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  /**
   * get the name of the window to show first
   * @returns {Promise<*>}
   */
  async function getStartupWindowName() {
    let launchSource = launchSourceService.getLaunchSource();

    if (launchSource === 'gamelaunchevent') {
      return WindowNames.IN_GAME;
    }

    let isGameRunning = await runningGameService.isGameRunning();
    if (isGameRunning) {
      return WindowNames.IN_GAME;
    }

    return WindowNames.SETTINGS;
  }

  return {
    restore,
    dragMove,
    minimize,
    getStartupWindowName
  }
});