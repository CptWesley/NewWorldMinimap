define(function () {
  function takeScreenshot() {
    return new Promise((resolve, reject) => {
      overwolf.media.getScreenshotUrl({
        roundAwayFromZero: 'true',
        rescale: {
          width: -0.5,
          height: -0.5
        }
      }, function(result) {
        if (result.status === 'success') {
          resolve(result.url);
        } else {
          reject(result);
        }
      });
    });
  }

  return {
    takeScreenshot
  }
});