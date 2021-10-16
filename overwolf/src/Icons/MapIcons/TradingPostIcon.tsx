import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function TradingPostIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 0.5,10 c 1,1 4,1 5,0 L 3,3 Z'
            strokeLinejoin='round'
        />
        <path
            d='M 3,1 C 2.446,1 2,1.446 2,2 V 3 H 7.7773438 L 6.5546875,13 1.5,14 1,15.5 H 15 L 14.5,14 9.4453125,13 8.2226562,3 H 14 V 2 C 14,1.446 13.554,1 13,1 H 8 Z'
        />
        <path
            d='m 10.5,10 c 1,1 4,1 5,0 l -2.5,-7 z'
            strokeLinejoin='round'
        />
    </SvgMapIcon>;
}
