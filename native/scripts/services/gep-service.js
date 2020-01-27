/**
 * Game Event Provider service
 * This will listen to events from the game provided by
 * Overwolf's Game Events Provider
 */
define([

],
  function () {

    const REQUIRED_FEATURES = [
      'counters',
      'death',
      'items',
      'kill',
      'killed',
      'killer',
      'location',
      'match_info',
      'match',
      'me',
      'phase',
      'rank',
      'revived',
      'team',
    ];
    const REGISTER_RETRY_TIMEOUT = 10000;

    function registerToGEP(eventsListener, infoListener) {
      overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, function (response) {
        if (response.status === 'error') {
          console.log(`Failed to register to GEP, retrying in ${REGISTER_RETRY_TIMEOUT / 1000}s...`);

          setTimeout(registerToGEP, REGISTER_RETRY_TIMEOUT, eventsListener, infoListener);
          
          return;
        }

        console.log(`Successfully registered to GEP.`);
        
        overwolf.games.events.onNewEvents.removeListener(eventsListener);
        overwolf.games.events.onNewEvents.addListener(eventsListener);

        overwolf.games.events.onInfoUpdates2.removeListener(infoListener);
        overwolf.games.events.onInfoUpdates2.addListener(infoListener);
      });
    }

    return {
      registerToGEP
    }
  });