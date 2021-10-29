type DynamicSettings = {
    channelsServerEndpoint: string,
}

type DynamicSettingsWindow = typeof window & {
    NWMM_getDynamicSettingsBackground: typeof getDynamicSettingsBackground;
}

const dynamicSettingsUrl = 'https://raw.githubusercontent.com/CptWesley/NewWorldMinimap/master/overwolf/dynamicSettings.json';
const isBackground = NWMM_APP_WINDOW === 'background';
const actualRetrieval = isBackground
    ? getDynamicSettingsBackground
    : (overwolf.windows.getMainWindow() as DynamicSettingsWindow).NWMM_getDynamicSettingsBackground;

let stored: DynamicSettings | undefined = undefined;

export function getDynamicSettings(): DynamicSettings | undefined {
    if (!stored) {
        stored = actualRetrieval();
    }

    return stored;
}

function getDynamicSettingsBackground(): DynamicSettings | undefined {
    return stored;
}

export function initializeDynamicSettings() {
    if (!isBackground) {
        return;
    }

    (window as DynamicSettingsWindow).NWMM_getDynamicSettingsBackground = getDynamicSettingsBackground;
    populateSettings();
}

async function fetchSettings(): Promise<DynamicSettings> {
    const req = await fetch(dynamicSettingsUrl, {
        method: 'get',
    });
    return (await req.json()) as DynamicSettings;
}

async function populateSettings() {
    const settings = await fetchSettings();
    stored = settings;
}
