import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function LoomIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <rect
            y='2.5'
            x='1'
            height='12'
            width='14'
            stroke='none'
        />
        <path
            d='M 8,0.5 C 3.8999255,0.5 0.5,3 0.5,3 v 12.5 h 15 V 3 C 15.5,3 12.100075,0.5 8,0.5 Z M 8,3 c 3.224357,0 5.5,1.5 5.5,1.5 v 9 h -11 v -9 C 2.5,4.5 4.7756427,3 8,3 Z'
        />
        <path
            d='M 3,9.5 H 6'
        />
        <path
            d='M 5,10.5 H 8'
        />
        <path
            d='m 8,9.5 h 4'
        />
        <path
            d='m 8,12.5 h 3'
        />
        <path
            d='M 7,11.5 H 4'
        />
        <path
            d='M 3,12.5 H 6'
        />
        <path
            d='m 9,10.5 h 2'
        />
        <path
            d='m 10,11.5 h 3'
        />
        <path
            d='m 4.4999941,9 1.18e-5,-5.5'
        />
        <path
            d='m 6.5,9 1.18e-5,-5.5'
        />
        <path
            d='m 8.5,9 1.18e-5,-6'
        />
        <path
            d='m 10.5,9 1.2e-5,-5.5'
        />
        <path
            d='m 12.5,9 1.2e-5,-5'
        />
    </SvgMapIcon>;
}
