import { useRef } from 'react';

type Interpolator<T> = (start: T, end: T, progress: number) => T;
type InterpolationState<T> = {
    previous: T,
    updateTime: number,
    current: T,
}

type Equality<T> = (a: T, b: T) => boolean;

function createInterpolationState<T>(initial: T): InterpolationState<T> {
    return {
        current: initial,
        previous: initial,
        updateTime: 0,
    };
}

export function useInterpolation<T>(interpolator: Interpolator<T>, initial: T, time: number, eq?: Equality<T>) {
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
        return getTimeDifference() >= time;
    }

    function get(): T {
        const timeDifference = getTimeDifference();

        if (timeDifference <= 0) {
            return state.previous;
        }

        if (timeDifference >= time) {
            return state.current;
        }

        const progress = timeDifference / time;
        return interpolator(state.previous, state.current, progress);
    }

    function update(next: T) {
        if (eq ? eq(state.current, next) : state.current === next) {
            return;
        }

        state.previous = get();
        state.current = next;
        state.updateTime = performance.now();
    }

    return {
        get,
        isDone,
        update,
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
