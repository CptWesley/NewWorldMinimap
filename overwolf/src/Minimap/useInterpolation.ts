import { useRef } from 'react';

type Interpolator<T> = (start: T, end: T, progress: number) => T;
type InterpolationState<T> = {
    previous: T,
    updateTime: number,
    current: T,
    duration: number | undefined,
}

type Equality<T> = (a: T, b: T) => boolean;

function createInterpolationState<T>(initial: T): InterpolationState<T> {
    return {
        current: initial,
        previous: initial,
        updateTime: 0,
        duration: undefined,
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
        return getTimeDifference() >= (state.duration || defaultDuration);
    }

    function get(): T {
        const timeDifference = getTimeDifference();

        if (timeDifference >= (state.duration || defaultDuration)) {
            return state.current;
        }

        const progress = timeDifference / (state.duration || defaultDuration);
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
    }

    return {
        get,
        isDone,
        update,
        getCurrentValue,
    };
}

function interpolateNumbers(start: number, end: number, progress: number) {
    return start * (1 - progress) + end * progress;
}

export function useNumberInterpolation(initial: number, time: number) {
    return useInterpolation(
        interpolateNumbers,
        initial,
        time,
    );
}
