import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function ChestIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 2,1.6998047 -0.5,0.3007812 1,4.5496094 -2,2.75 v 4.9999997 h 15 V 9.3001953 l -2,-2.75 1,-4.5496094 L 14,1.6998047 Z'
        />
        <path
            d='m 0.5,9.2689453 h 15'
        />
        <path
            d='M 7,10.800195 H 9'
        />
        <path
            d='m 2.5,6.5501953 h 11'
        />
    </SvgMapIcon>;
}
