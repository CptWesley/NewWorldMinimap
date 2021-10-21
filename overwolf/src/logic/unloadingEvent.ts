/**
 * An event registration mechanism, which requires a Window object to be passed
 * with each registration. Once the window closes, the event subscription is
 * automatically removed from the listener set.
 */
export default class UnloadingEvent<TListener extends (...args: any[]) => any> {
    private listeners = new Set<TListener>();

    constructor(private name: string) { }

    public register = (listener: TListener, listenerWindow: Window) => {
        this.listeners.add(listener);
        if (process.env.NODE_ENV === 'development') {
            console.debug(`Window ${listenerWindow.document?.title ?? '(unknown)'} registered for event ${this.name}.`);
        }
        const cleanup = () => {
            listenerWindow.removeEventListener('beforeunload', handleBeforeUnload);
            const deleted = this.listeners.delete(listener);
            if (process.env.NODE_ENV === 'development') {
                console.debug(`Window ${listenerWindow.document?.title ?? '(unknown)'} unregistered for event ${this.name} (${deleted ? 'first' : 'again'}).`);
            }
        };
        function handleBeforeUnload() {
            cleanup();
        }
        listenerWindow.addEventListener('beforeunload', cleanup);
        return cleanup;
    }

    public fire = (...args: Parameters<TListener>) => {
        this.listeners.forEach(l => {
            try {
                l(...args);
            } catch (err) {
                console.error(err);
                // but continue anyway
            }
        });
    }
}
