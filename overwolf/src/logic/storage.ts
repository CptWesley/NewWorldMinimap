import { ConcreteWindow } from '../OverwolfWindows/consts';

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

export type SimpleStorageSetting = typeof simpleStorageDefaultSettings;

export const scopedSettings: (keyof SimpleStorageSetting)[] = [
    'iconScale',
    'showHeader',
    'showText',
    'showToolbar',
    'transparentHeader',
    'transparentToolbar',
    'zoomLevel',
];

export const iconSettingStorageScope = 'icon';
export type KnownStorageScope = ConcreteWindow | typeof iconSettingStorageScope;
export const knownStorageScopes: KnownStorageScope[] = ['desktop', 'icon', 'inGame'];
const defaultHiddenIconCategories = ['npc', 'pois'];

export function store<TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) {
    let storageKey: string = key;
    if (scopedSettings.includes(key) && NWMM_APP_WINDOW) {
        storageKey = NWMM_APP_WINDOW + '::' + key;
    }

    localStorage.setItem(storageKey, JSON.stringify(value));
}

export function load<TKey extends keyof SimpleStorageSetting>(key: TKey) {
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

export function storeIconCategory(category: string, value: boolean) {
    const key = `${iconSettingStorageScope}::${category}.visible`;
    return storeUntyped(key, value);
}

export function storeIconType(category: string, type: string, value: boolean) {
    const key = `${iconSettingStorageScope}::${category}-${type}.visible`;
    return storeUntyped(key, value);
}

export function loadIconCategory(category: string) {
    const key = `${iconSettingStorageScope}::${category}.visible`;
    return loadUntyped(key, !defaultHiddenIconCategories.includes(category)) as boolean;
}

export function loadIconType(category: string, type: string) {
    const key = `${iconSettingStorageScope}::${category}--${type}.visible`;
    return loadUntyped(key, true) as boolean;
}

export function getStorageKeyScope(key: string): [KnownStorageScope | undefined, string] {
    const potentialScope = key.split('::', 2) as [KnownStorageScope, string];
    return knownStorageScopes.includes(potentialScope[0])
        ? [potentialScope[0], potentialScope[1] ?? '']
        : [undefined, key];
}

/**
 * Obtains the category (and optionally, type) of an icon setting storage key.
 * @param identifier The identifier of the key, without the scope.
 */
export function deconstructIconStorageKey(identifier: string): string | [string, string] {
    const withoutProperty = identifier.split('.')[0];
    const categoryAndType = withoutProperty.split('--');
    if (categoryAndType.length === 2) {
        return [categoryAndType[0], categoryAndType[1]];
    } else {
        return categoryAndType[0];
    }
}
