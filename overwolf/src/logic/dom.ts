/**
 * Checks whether the element, or any of its parents, satisfy the predicate.
 * @param element The element to check.
 * @param predicate The predicate to check for.
 * @returns Whether the element, or any of its parents, satisfy the predicate.
 */
export function containedByInclusive(element: HTMLElement | null, predicate: (el: HTMLElement) => boolean) {
    let el = element;
    while (el) {
        if (predicate(el)) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
}
