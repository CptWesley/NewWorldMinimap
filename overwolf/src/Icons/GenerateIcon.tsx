import React from 'react';

export default function GenerateIcon() {
    return (
        <svg viewBox='0 0 40 40'>
            <mask id='mask' fill='white'>
                <rect x='0' y='0' width='40' height='40' fill='white'></rect>
                <rect x='0' y='20' width='20' height='20' fill='black'></rect>
            </mask>
            <circle cx='20' cy='20' r='10' fill='none' stroke='currentcolor' strokeWidth='3' mask='url(#mask)'></circle>
            <path d='M 25,25 20,30 25,35' fill='none' stroke='currentcolor' strokeWidth='3' transform='rotate(-5 20 30)'></path>
        </svg>
    );
}
