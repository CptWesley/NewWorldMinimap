export type SimpleStorageSettings = {
    showHeader: boolean,
    showToolbar: boolean,
    transparentHeader: boolean,
    transparentToolbar: boolean,
    showText: boolean,
    iconScale: number,
    zoomLevel: number,
    opacity: number,
    shape: string,
    compassMode: boolean;
}

export function store<TKey extends keyof SimpleStorageSettings>(key: TKey, value: SimpleStorageSettings[TKey]) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load<TKey extends keyof SimpleStorageSettings>(key: TKey, defaultValue: SimpleStorageSettings[TKey]) {
    const retrieved = localStorage.getItem(key);

    if (retrieved) {
        return JSON.parse(retrieved);
    }

    return defaultValue;
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
