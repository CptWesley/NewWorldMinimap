import React from 'react';
import SvgMapIcon, { ISvgMapIconProps } from './SvgMapIcon';

export default function PlayerIcon(props: ISvgMapIconProps) {
    return <SvgMapIcon {...props}>
        <path d='M 1,15 C 3,15 6,13 8,11 C 10,13 13,15 15,15 C 17,15 10,1 8,1 C 6,1 -1,15 1,15 Z' />
    </SvgMapIcon>;
}
