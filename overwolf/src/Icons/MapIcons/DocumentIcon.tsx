import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function DocumentIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 12.5,15 c 0,0 3,-1 3,-3 V 4 c 0,-2 -3,-3 -3,-3 H 2.9499172 c 0,0 3,1 3,3 v 8 c 0,2 -3,3 -3,3 z'
        />
        <path
            style={{ fill: 'none', strokeLinecap: 'round' }}
            d='m 2.9499172,1 c 0,0 -1.96659682,-0.009927 -1.96659682,2.0383495 0,0 -0.005227,1.7819562 2.32588102,1.7507062'
        />
        <path
            d='m 8,5 h 6'
        />
        <path
            d='m 8,8 h 6'
        />
        <path
            d='m 8,11 h 6'
        />
    </SvgMapIcon>;
}
