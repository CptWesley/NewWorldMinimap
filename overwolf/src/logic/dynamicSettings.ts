type DynamicSettings = {
    channelsServerEndpoint: string,
}

const dynamicSettingsUrl = 'https://raw.githubusercontent.com/CptWesley/NewWorldMinimap/master/overwolf/dynamicSettings.json';

let stored: DynamicSettings | undefined = undefined;

function getDynamicSettings(): DynamicSettings | undefined {
    return stored;
}

export function initializeDynamicSettings() {
    populateSettings();
    return getDynamicSettings;
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
