import React from 'react';

export default function CompassIcon() {
    return (
        <svg viewBox='0 0 30 30' stroke='currentColor' fill='none' strokeWidth='1'>
            <circle
                r='13'
                cy='15'
                cx='15'
            />
            <path
                d='m 15,6 -4,9 4,9 4,-9 z'
            />
            <path
                d='M 11,15 H 15 V 25 Z'
                stroke='none'
                fill='currentColor'
            />
            <path
                d='M 19,15 H 15 V 5 Z'
                stroke='none'
                fill='currentColor'
            />
        </svg>
    );
}
