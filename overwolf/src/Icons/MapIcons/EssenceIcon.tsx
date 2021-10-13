import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function EssenceIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 7.9628906 0.5 A 7.5 7.5 0 0 0 0.5 8 A 7.5 7.5 0 0 0 8 15.5 A 7.5 7.5 0 0 0 15.5 8 A 7.5 7.5 0 0 0 8 0.5 A 7.5 7.5 0 0 0 7.9628906 0.5 z M 8 3.5 A 4.5 4.5 0 0 1 12.5 8 A 4.5 4.5 0 0 1 8 12.5 A 4.5 4.5 0 0 1 3.5 8 A 4.5 4.5 0 0 1 8 3.5 z '
        />
    </SvgMapIcon>;
}
