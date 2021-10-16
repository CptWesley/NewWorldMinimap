import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function TerritoryBoardIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 4,14.75 8,11.75 12,14.75 V 9.5 L 8,6.5 4,9.5 Z'
        />
        <path
            d='m 4,7 4,-3 4,3 v -3 L 8,1 4,4 Z'
        />
    </SvgMapIcon>;
}
