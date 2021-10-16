import React from 'react';
import SvgMapIcon, { getSvgMapIconProps, ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function GovernorDeskIcon(props: ISvgMapIconConsumerProps) {
    const {
        stroke,
    } = getSvgMapIconProps(props);

    return <SvgMapIcon {...props}>
        <path
            d='m 0.5,0.5 h 15 v 10 l -7.5,5 -7.5,-5 z'
        />
        <path
            d='M 0,3.5 H 16'
        />
        <path
            d='M 11,4 8,8 5,4 Z'
            fill={stroke}
            stroke='none'
        />
    </SvgMapIcon>;
}
