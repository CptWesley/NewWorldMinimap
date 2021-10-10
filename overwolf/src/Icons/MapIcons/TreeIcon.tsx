import React from 'react';
import SvgMapIcon, { ISvgMapIconProps } from './SvgMapIcon';

export default function TreeIcon(props: ISvgMapIconProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 0.5,15.5 v -2 H 7 V 11.499617 H 3.7973823 1.9466129 c -0.3684582,0 0.097786,-0.941233 0.097786,-0.941233 0,0 4.4291689,-8.5561663 4.9556011,-9.058384 C 7.5264321,0.997782 8,1 8,1 8,1 8.4735679,0.997782 9,1.5 c 0.5264322,0.5022177 4.955601,9.058384 4.955601,9.058384 0,0 0.466244,0.941233 0.09779,0.941233 H 12.202618 9 V 13.5 h 6.5 v 2 H 8 Z'
        />
        <path
            style={{ strokeWidth: 1.5 }}
            d='m 5.8660227,4.9959032 c 1.0669885,0.5544526 3.2009655,0.5544526 4.2679543,0'
        />
        <path
            style={{ strokeWidth: 1.5 }}
            d='m 4.3858377,7.9577261 c 1.8070811,1.0032609 5.4212433,1.0032609 7.2283243,0'
        />
    </SvgMapIcon>;
}
