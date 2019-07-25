define([
  '../constants/window-names.js',
  '../services/launch-source-service.js',
  '../services/running-game-service.js',
  '../services/utils-service.js',
], function (WindowNames,
             launchSourceService,
             runningGameService,
             utilsService) {

  /**
   * obtain a window object by a name as declared in the manifest
   * this is required in order to create the window before calling other APIs
   * on that window
   * @param name
   * @returns {Promise<any>}
   */
  function obtainWindow(name) {
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
        await obtainWindow(name);
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
        await obtainWindow(name);
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
        await obtainWindow(name);
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
   * change window size by window id
   * @param windowId
   * @returns {Promise<any>}
   */
  function changeSize(windowId, width, height) {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.windows.changeSize(windowId, width, height, (result) => {
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

    return WindowNames.DESKTOP;
  }

  /**
   * Returns a map (window name, object) of all open windows.
   * @returns {Promise<any>}
   */
  function getOpenWindows() {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.windows.getOpenWindows((result) => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Close a window
   * @param windowName
   * @returns {Promise<any>}
   */
  function close(windowName) {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.windows.close(windowName, () => {
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * get state of the window
   * @returns {Promise<*>}
   */
  async function getWindowState(name) {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.windows.getWindowState(name, (state) => {
          if (state.status === 'success') {
            resolve(state.window_state_ex);
          } else {
            reject(result);
          }
        })
      } catch (e){
        reject(e);
      }
    });
  }

  /**
   * Change window position
   * @returns {Promise<*>}
   */
  async function changePosition(windowId, left, top) {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.windows.changePosition(windowId, left, top, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        })
      } catch (e){
        reject(e);
      }
    });
  }

  /**
   * Change window position to screen center
   * @returns {Promise<*>}
   */
  async function changePositionCenter(windowId) {
    const window = await obtainWindow(windowId);
    const monitors = await utilsService.getMonitorsList();

    const { width: windowWidth, height: windowHeight } = window.window;
    const { width: monitorWidth, height: monitorHeight } = monitors[0];

    const left = (monitorWidth / 2) - (windowWidth /  2);
    const top = (monitorHeight / 2) - (windowHeight /  2);

    return await changePosition(windowId, parseInt(left), parseInt(top));
  }

  return {
    restore,
    dragMove,
    minimize,
    getStartupWindowName,
    obtainWindow,
    changeSize,
    getOpenWindows,
    close,
    getWindowState,
    changePosition,
    changePositionCenter
  }
});