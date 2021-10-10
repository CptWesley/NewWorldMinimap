import React from 'react';
import SvgMapIcon, { ISvgMapIconProps } from './SvgMapIcon';

export default function SkullIcon(props: ISvgMapIconProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 8 0.5 C 3.3950297 0.5 1.5 1.6441616 1.5 4.1328125 C 1.5 6.38769 2.5 5.4776385 2.5 9.0371094 C 2.5 11.114235 4 9.1037752 4 11.259766 L 4 14 L 5.5 15.5 L 8 15.5 L 10.5 15.5 L 12 14 L 12 11.259766 C 12 9.1037752 13.5 11.114235 13.5 9.0371094 C 13.5 5.4776385 14.5 6.38769 14.5 4.1328125 C 14.5 1.6441616 12.60497 0.5 8 0.5 z M 5.5 3.5 A 1.5 1.5 0 0 1 7 5 A 1.5 1.5 0 0 1 5.5 6.5 A 1.5 1.5 0 0 1 4 5 A 1.5 1.5 0 0 1 5.5 3.5 z M 10.5 3.5 A 1.5 1.5 0 0 1 12 5 A 1.5 1.5 0 0 1 10.5 6.5 A 1.5 1.5 0 0 1 9 5 A 1.5 1.5 0 0 1 10.5 3.5 z '
        />
        <path
            d='M 5.5,9 8,8 10.5,9'
        />
        <path
            d='m 8,11.5 v 2'
        />
        <path
            d='m 10,11.5 v 2'
        />
        <path
            d='m 6,11.5 v 2'
        />
    </SvgMapIcon>;
}
