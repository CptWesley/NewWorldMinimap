import React from 'react';

export default function CompassIcon() {
    return (
        <svg viewBox='0 0 30 30' stroke='currentColor' fill='none' strokeWidth='1' >
            <circle
                r='10.5'
                cy='15'
                cx='15'
            />
            <path
                d='m 15,7 -3,7.5 h 6 z'
            />
            <path
                d='m 15,23 -3,-7.5 h 6 z'
                fill='currentColor'
            />
        </svg>
    );
}
