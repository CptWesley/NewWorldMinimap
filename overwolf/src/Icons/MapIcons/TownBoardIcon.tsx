import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function TownBoardIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 4.8283643,6.1 3.6478412,8 8.0000004,15 12.35216,8 11.171636,6.1 8.0000004,7.9960938 Z'
        />
        <path
            d='M 5.2340817,5.4486952 8.0000005,0.99999997 10.765919,5.4486954 8.0000001,7.8095415 Z'
        />
    </SvgMapIcon>;
}
