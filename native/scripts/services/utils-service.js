define([], function () {

  /**
   * Change window position
   * @returns {Promise<*>}
   */
  async function getMonitorsList() {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.utils.getMonitorsList((result) => {
          resolve(result.displays);
        })
      } catch (e){
        reject(e);
      }
    });
  }

  return {
    getMonitorsList
  }
});