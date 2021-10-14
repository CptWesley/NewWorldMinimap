export const simpleStorageDefaultSettings = {
    showHeader: true,
    showToolbar: false,
    transparentHeader: true,
    transparentToolbar: true,
    showText: false,
    iconScale: 1.5,
    zoomLevel: 2,
    opacity: 1,
    shape: 'none',
    compassMode: true,
};

export type SimpleStorageSettings = typeof simpleStorageDefaultSettings;

const scopedSettings: (keyof SimpleStorageSettings)[] = [
    'iconScale',
    'showHeader',
    'showText',
    'showToolbar',
    'transparentHeader',
    'transparentToolbar',
    'zoomLevel',
];

export function store<TKey extends keyof SimpleStorageSettings>(key: TKey, value: SimpleStorageSettings[TKey]) {
    let storageKey: string = key;
    if (scopedSettings.includes(key) && NWMM_APP_WINDOW) {
        storageKey = NWMM_APP_WINDOW + '::' + key;
    }

    localStorage.setItem(storageKey, JSON.stringify(value));
}

export function load<TKey extends keyof SimpleStorageSettings>(key: TKey) {
    let storageKey: string = key;

    if (scopedSettings.includes(key) && NWMM_APP_WINDOW) {
        storageKey = NWMM_APP_WINDOW + '::' + key;
    }

    const retrieved = localStorage.getItem(storageKey);

    if (retrieved) {
        return JSON.parse(retrieved);
    }

    return simpleStorageDefaultSettings[key];
}

function storeUntyped<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadUntyped<T>(key: string, defaultValue: T) {
    const retrieved = localStorage.getItem(key);

    if (retrieved) {
        return JSON.parse(retrieved);
    }

    return defaultValue;
}

export function storeIconCategory(name: string, value: boolean) {
    const key = 'icon.category.' + name + '.visible';
    return storeUntyped(key, value);
}

export function storeIconType(name: string, value: boolean) {
    const key = 'icon.type.' + name + '.visible';
    return storeUntyped(key, value);
}

export function loadIconCategory(name: string) {
    const key = 'icon.category.' + name + '.visible';
    return loadUntyped(key, name !== 'npc' && name !== 'pois') as boolean;
}

export function loadIconType(name: string) {
    const key = 'icon.type.' + name + '.visible';
    return loadUntyped(key, true) as boolean;
}
