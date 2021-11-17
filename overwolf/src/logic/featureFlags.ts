const forbiddenFeaturesKey = 'DANGER_ENABLE_FORBIDDEN_FEATURES';

const enableForbiddenFeatures = localStorage.getItem(forbiddenFeaturesKey) === true.toString();

export const canDrawPlayer = true;
export const canDrawMarkers = enableForbiddenFeatures;
export const canDrawFriends = enableForbiddenFeatures;
export const canDrawNavigation = enableForbiddenFeatures;
