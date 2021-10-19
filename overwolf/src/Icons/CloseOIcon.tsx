import React from 'react';

export default function CloseOIcon() {
    return (
        <svg viewBox='0 0 40 40'>
            <circle
                r='19'
                cy='20'
                cx='20'
                style={{ fill: 'none', stroke: 'currentcolor', strokeWidth: 2 }}
            />
            <path
                d='M 10,10 30,30'
                style={{ fill: 'none', stroke: 'currentcolor', strokeWidth: 2 }}
            />
            <path
                d='M 30,10 10,30'
                style={{ fill: 'none', stroke: 'currentcolor', strokeWidth: 2 }}
            />
        </svg>
    );
}
