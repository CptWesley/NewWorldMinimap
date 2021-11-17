const forbiddenFeaturesKey = 'DANGER_ENABLE_FORBIDDEN_FEATURES';

export const enableForbiddenFeatures = localStorage.getItem(forbiddenFeaturesKey) === true.toString();
