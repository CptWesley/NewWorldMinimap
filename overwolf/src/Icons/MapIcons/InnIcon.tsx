import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function InnIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 7.9628906 0.5 A 7.5 7.5 0 0 0 0.5 8 A 7.5 7.5 0 0 0 8 15.5 A 7.5 7.5 0 0 0 15.5 8 A 7.5 7.5 0 0 0 8 0.5 A 7.5 7.5 0 0 0 7.9628906 0.5 z M 5.9804688 3.9785156 A 4.5 4.5000014 0 0 0 5.5 6 A 4.5 4.5000014 0 0 0 10 10.5 A 4.5 4.5000014 0 0 0 12.019531 10.021484 A 4.5 4.5000014 0 0 1 8 12.5 A 4.5 4.5000014 0 0 1 3.5 8 A 4.5 4.5000014 0 0 1 5.9804688 3.9785156 z '
            strokeLinejoin='round'
        />
    </SvgMapIcon>;
}
