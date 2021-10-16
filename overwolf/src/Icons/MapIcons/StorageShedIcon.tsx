import React from 'react';
import SvgMapIcon, { getSvgMapIconProps, ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function StorageShedIcon(props: ISvgMapIconConsumerProps) {
    const {
        stroke,
    } = getSvgMapIconProps(props);

    return <SvgMapIcon {...props}>
        <rect
            y='1'
            x='0.5'
            height='14'
            width='15'
            stroke='none'
        />
        <path
            d='M 0.5,1 V 15'
        />
        <path
            d='M 15.5,1 V 15'
        />
        <rect
            y='5.5007849'
            x='5.5007849'
            height='2.99843'
            width='4.9984298'
        />
        <path
            d='M 2,3.5 H 14'
        />
        <path
            d='M 2,1.5 H 14'
        />
        <path
            d='M 2,10.5 H 14'
        />
        <path
            d='M 2,12.5 H 14'
        />
        <path
            d='M 2,14.5 H 14'
        />
        <path
            d='M 2,8.5 H 4'
        />
        <path
            d='m 12,8.5 h 2'
        />
        <rect
            y='5'
            x='1'
            height='2'
            width='14'
            fill={stroke}
            stroke='none'
        />
    </SvgMapIcon>;
}
