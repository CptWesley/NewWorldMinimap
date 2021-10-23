import { useRef } from 'react';

export type Interpolator<T> = undefined | ((start: T, end: T, progress: number) => T);
type InterpolationState<T> = {
    previous: T,
    updateTime: number,
    current: T,
    duration: number | undefined,
    done: boolean,
}

type Equality<T> = (a: T, b: T) => boolean;

function createInterpolationState<T>(initial: T): InterpolationState<T> {
    return {
        current: initial,
        previous: initial,
        updateTime: 0,
        duration: undefined,
        done: true,
    };
}

export function useInterpolation<T>(interpolator: Interpolator<T>, initial: T, defaultDuration: number, eq?: Equality<T>) {
    const stateRef = useRef<InterpolationState<T>>();
    if (!stateRef.current) {
        stateRef.current = createInterpolationState(initial);
    }

    const state = stateRef.current;

    function getTimeDifference(): number {
        const now = performance.now();
        return now - state.updateTime;
    }

    function isDone(): boolean {
        return state.done;
    }

    function get(): T {
        const timeDifference = getTimeDifference();

        if (timeDifference >= (state.duration ?? defaultDuration) || !interpolator) {
            state.done = true;
            return state.current;
        }

        const progress = timeDifference / (state.duration ?? defaultDuration);
        return interpolator(state.previous, state.current, progress);
    }

    function getCurrentValue() {
        return state.current;
    }

    function update(next: T, duration?: number) {
        if (eq ? eq(state.current, next) : state.current === next) {
            return;
        }

        state.previous = get();
        state.current = next;
        state.updateTime = performance.now();
        state.duration = duration;
        state.done = false;
    }

    return {
        get,
        isDone,
        update,
        getCurrentValue,
    };
}
