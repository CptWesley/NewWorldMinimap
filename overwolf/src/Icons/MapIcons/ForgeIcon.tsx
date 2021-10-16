import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function ForgeIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 2.359375,4 C 0.3065862,4 -0.03497084,6.1905609 1.5,7 L 5,9 v 2 H 3 v 2 h 9 V 11 H 9 V 9 L 14.631084,6.7891524 C 16.386308,5.8179388 15.312737,5 13.354988,5 H 10 V 4 Z'
        />
        <path
            d='M 10,5 V 8.5'
        />
        <path
            d='M 5,9 H 9'
        />
    </SvgMapIcon>;
}
