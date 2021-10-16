import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function WoodshopIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 0.5,11.5 v -7 H 2 L 5.4639218,3.8569811 5.964169,6.416864 4.5,7 v 4.5 z'
        />
        <path
            d='M 4.5,13.28804 V 7.296835 L 13.81897,3.6846658 15.227324,6.8324988 13.945002,7.7449102 11.724665,7.0982318 11.270984,9.147858 9.1519788,8.4653532 8.7063403,10.660181 6.7096544,10.05312 6.2510717,12.281879 Z'
        />
        <path
            d='m 2.5,6.5 v 3'
        />
    </SvgMapIcon>;
}
