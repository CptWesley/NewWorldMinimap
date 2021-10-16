import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function StonecuttingTableIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 1.6378092,13.152166 3.7591294,15.273487 11.961548,7.0710678 13.388253,8.4977724 15.497082,8.4852814 15.484591,6.35147 14.082868,4.9497475 14.789975,4.2426407 12.668655,2.1213204 11.961548,2.8284272 9.8402273,0.70710676 7.7189069,2.8284272 9.8402273,4.9497475 Z'
        />
        <path
            d='M 9.8402273,4.9497475 10.793743,5.9032634'
        />
        <path
            d='m 1.7071068,2 1,-1 4.875,5.125 L 10.707107,8 14.394607,14.6875 7.7071068,11 5.8321068,7.875 0.70710678,3 1.7071068,2'
        />
    </SvgMapIcon>;
}
