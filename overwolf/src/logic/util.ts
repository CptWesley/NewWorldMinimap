export function compareNames([, v1]: [string, any], [, v2]: [string, any]) {
    const s1 = v1 as IconTypeSetting;
    const s2 = v2 as IconTypeSetting;
    return s1.name.localeCompare(s2.name);
}
