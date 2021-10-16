import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function OutfittingStationIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 8,0.5 H 2.5 l 2,2 v 11 l -2,2 H 8 m 0,-15 h 5.5 l -2,2 v 11 l 2,2 H 8'
        />
        <path
            d='M 3.5,7.5 H 12.5 V 11.5 H 3.5 Z m 0,-2 H 12.5 v 4 H 3.5 Z'
        />
        <path
            d='m 4.5,2.5 h 7'
        />
        <path
            d='m 4.5,13.5 h 7'
        />
    </SvgMapIcon>;
}
