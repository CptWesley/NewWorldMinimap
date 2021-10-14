export function store(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key: string, defaultValue: any) {
    const retrieved = localStorage.getItem(key);

    if (retrieved) {
        return JSON.parse(retrieved);
    }

    return defaultValue;
}

export function storeIconCategory(name: string, value: boolean) {
    const key = 'icon.category.' + name + '.visible';
    return store(key, value);
}

export function storeIconType(name: string, value: boolean) {
    const key = 'icon.type.' + name + '.visible';
    return store(key, value);
}

export function loadIconCategory(name: string) {
    const key = 'icon.category.' + name + '.visible';
    return load(key, name !== 'npc' && name !== 'pois') as boolean;
}

export function loadIconType(name: string) {
    const key = 'icon.type.' + name + '.visible';
    return load(key, true) as boolean;
}
