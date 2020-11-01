define([ ], function () {

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
            reject(state);
          }
        })
      } catch (e){
        reject(e);
      }
    });
  }
  
  return {
    restore,
    minimize,
    obtainWindow,
    getOpenWindows,
    close,
    getWindowState
  }
});
