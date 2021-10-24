import { ConcreteWindow } from '../OverwolfWindows/consts';
import { roadsToGraph } from './navigation';

const debugLocations = {
    default: { x: 7728.177, y: 1988.299 } as Vector2,
    city: { x: 8912, y: 5783 } as Vector2,
};

export type Interpolation =
    | 'cosine-interpolation'
    | 'linear-interpolation'
    | 'cosine-extrapolation'
    | 'linear-extrapolation'
    | 'none';

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
    townZoomLevel: 1,
    townZoom: true,
    interpolation: 'cosine-interpolation' as Interpolation,
    shareLocation: false,
    friends: '',
    resamplingRate: 30,
    lastKnownPosition: debugLocations.default,
    friendServerUrl: '',
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
    'townZoomLevel',
    'townZoom',
    'interpolation',
    'resamplingRate',
    'friendServerUrl',
];

export const iconSettingStorageScope = 'icon';
export type KnownStorageScope = ConcreteWindow | typeof iconSettingStorageScope;
export const knownStorageScopes: KnownStorageScope[] = ['desktop', 'icon', 'inGame'];
const defaultHiddenIconCategories = ['npc', 'pois'];

export const zoomLevelSettingBounds = [0.5, 7] as const;

/** Stores a simple storage setting. A scope will be added to the key, if the setting is a scoped setting. */
export function store<TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) {
    let storageKey: string = key;
    if (scopedSettings.includes(key) && NWMM_APP_WINDOW) {
        storageKey = NWMM_APP_WINDOW + '::' + key;
    }

    localStorage.setItem(storageKey, JSON.stringify(value));
}

export function storeRoads(graph: NavigationGraph) {
    const arr: Vector2[] = [];

    for (let i = 0; i < graph.nodes.length; i++) {
        if (!graph.markedForDeletion.has(i)) {
            arr.push(graph.nodes[i].position);
        }
    }

    localStorage.setItem('roads', JSON.stringify({
        nodes: arr,
        cuts: graph.severNodes,
    }));
}

export function loadRoads(): NavigationGraph {
    const obj = JSON.parse(localStorage.getItem('roads') ?? '[]');
    return {
        nodes: roadsToGraph(obj.nodes),
        markedForDeletion: new Set<number>(),
        severNodes: obj.cuts,
    };
}

/** Loads a simple storage setting. A scope will be added to the key, if the setting is a scoped setting. */
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

const iconCategoryTypeSeparator = '--';
function getIconPropertySettingKey(category: string, type: string | undefined, property: IconProperty) {
    return type
        ? `${iconSettingStorageScope}::${category}${iconCategoryTypeSeparator}${type}.${property}`
        : `${iconSettingStorageScope}::${category}.${property}`;
}

export function storeIconConfiguration(category: string, type: string | undefined, property: IconProperty, value: boolean) {
    const key = getIconPropertySettingKey(category, type, property);
    return storeUntyped(key, value);
}

export function loadIconConfiguration(category: string, type: string | undefined, property: IconProperty) {
    const key = getIconPropertySettingKey(category, type, property);
    return loadUntyped(key, getDefaultIconConfigurationValue(category, type, property)) as boolean;
}

function getDefaultIconConfigurationValue(category: string, type: string | undefined, property: IconProperty): boolean {
    switch (property) {
        case 'showLabel':
            return true;
        case 'visible':
            return type
                ? true // it's not a category
                : !defaultHiddenIconCategories.includes(category); // it's a category
    }
}

/** Splits a storage key into its scope (if it exists and is known), and the rest of the key (which is called the identifier). */
export function getStorageKeyScope(key: string): [KnownStorageScope | undefined, string] {
    const potentialScope = key.split('::', 2) as [KnownStorageScope, string];
    return knownStorageScopes.includes(potentialScope[0])
        ? [potentialScope[0], potentialScope[1] ?? '']
        : [undefined, key];
}

const iconProperties: IconProperty[] = ['showLabel', 'visible'];
/**
 * Obtains the category (and optionally, type) of an icon setting storage key.
 * @param identifier The identifier of the key, without the scope.
 * @returns a string if it's just a category; or an array of two strings, containing category and type.
 */
export function deconstructIconStorageKey(identifier: string) {
    const propertySplit = identifier.split('.');
    if (propertySplit.length !== 2) { return undefined; }
    if (!iconProperties.includes(propertySplit[1] as IconProperty)) { return undefined; }
    const categoryAndType = propertySplit[0].split('--');
    if (categoryAndType.length < 1 || categoryAndType.length > 2) { return undefined; }
    return {
        property: propertySplit[1] as IconProperty,
        category: categoryAndType[0],
        type: categoryAndType.length === 2 ? categoryAndType[1] : undefined,
    };
}
