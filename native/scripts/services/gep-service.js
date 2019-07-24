/**
 * Game Event Provider service
 * This will listen to events from the game provided by
 * Overwolf's Game Events Provider
 */
define([

  ],
  function () {

    const REQUIRED_FEATURES = [
      'kill', 'killed', 'killer', 'revived', 'death', 'match', 'match_info',
      'rank', 'me', 'phase', 'location', 'team', 'items', 'counters'
    ];
    const REGISTER_RETRY_TIMEOUT = 10000;

    function registerToGEP(eventsListener, infoListener) {
      // set the features we are interested in receiving
      overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, function (response) {
        if (response.status === 'error') {
          setTimeout(registerToGEP, REGISTER_RETRY_TIMEOUT);
        } else if (response.status === 'success') {
          // Listen to game events. We call 'removeListener' before
          // 'addListener' to make sure we don't listen multiple times
          overwolf.games.events.onNewEvents.removeListener(eventsListener);
          overwolf.games.events.onNewEvents.addListener(eventsListener);

          // Listen to info updates
          overwolf.games.events.onInfoUpdates2.removeListener(infoListener);
          overwolf.games.events.onInfoUpdates2.addListener(infoListener);
        }
      });
    }

    return {
      registerToGEP
    }
  });