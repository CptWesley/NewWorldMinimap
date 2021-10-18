import React from 'react';

export default function GlobeIcon(props: Omit<React.SVGProps<SVGSVGElement>, 'viewBox'>) {
    return (
        <svg viewBox='0 0 40 40' {...props}>
            <circle
                stroke='currentcolor'
                strokeWidth='3'
                fill='none'
                cx='20'
                cy='20'
                r='18.5'
            />
            <ellipse
                stroke='currentcolor'
                strokeWidth='3'
                fill='none'
                cy='20'
                cx='20'
                rx='10'
                ry='18.5'
            />
            <path
                stroke='currentcolor'
                strokeWidth='3'
                d='M 20,1 V 39'
            />
            <path
                stroke='currentcolor'
                strokeWidth='3'
                d='M 1,20 H 39'
            />
            <path
                stroke='currentcolor'
                strokeWidth='3'
                fill='none'
                d='m 4,10 c 10,4 22,4 32,0'
            />
            <path
                stroke='currentcolor'
                strokeWidth='3'
                fill='none'
                d='m 4,30 c 10,-4 22,-4 32,0'
            />
        </svg>
    );
}
