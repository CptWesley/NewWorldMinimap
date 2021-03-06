import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function KitchenIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 6,7 C 6,7 7.5,7 7.5,6 V 0.5 h -6 V 6 C 1.5,7 3,7 3,7 3,14.890625 3.00112,15.5 4.5,15.5 5.9988788,15.5 6,14.929688 6,7 Z'
        />
        <path
            d='M 3.5,0.5 V 5'
        />
        <path
            d='M 5.5,0.5 V 5'
        />
        <path
            d='m 12.000313,15.5 c -1.498901,0 -1.5,-0.609375 -1.5,-8.5 0,0 -1.5625005,-0.5742202 -1.5625005,-1.734375 0,-1.1601548 0.7187495,-2.2586174 1.2500005,-3.328125 C 10.719063,0.8679924 11.100196,0.5 12.000313,0.5 m -6.26e-4,15 c 1.498901,0 1.5,-0.609375 1.5,-8.5 0,0 1.562501,-0.5742202 1.562501,-1.734375 0,-1.1601548 -0.71875,-2.2586174 -1.250001,-3.328125 C 13.280937,0.8679924 12.899804,0.5 11.999687,0.5'
        />
    </SvgMapIcon>;
}
