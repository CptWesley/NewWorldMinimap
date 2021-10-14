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
