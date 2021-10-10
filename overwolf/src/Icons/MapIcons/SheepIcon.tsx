import React from 'react';
import SvgMapIcon, { ISvgMapIconProps } from './SvgMapIcon';

export default function SheepIcon(props: ISvgMapIconProps) {
    return <SvgMapIcon {...props}>
        <path
            d='M 8,0.5 C 5.7885243,0.5 3.4235398,0.52765999 2.4969708,1.2705825 1.4897809,2.0781468 -0.92686014,7.0584965 1.7456699,10.297243 4.4181999,13.535989 4.1148566,15.5 8,15.5 m 0,-15 c 2.211476,0 4.57646,0.02766 5.503029,0.7705825 1.00719,0.8075643 3.423831,5.787914 0.751301,9.0266605 C 11.5818,13.535989 11.885143,15.5 8,15.5'
            style={{ opacity: 0.5 }}
        />
        <path
            d='M 8,2.6 C 6.1127934,2.6 3.2061905,2.7861509 2.5389963,3.0720908 1.871802,3.3580312 1.0533872,3.9706126 0.73842462,4.9311378 0.50922946,5.6301026 0.17043277,7.7049548 1.3310454,7.3939696 2.3696846,7.1156671 2.6573173,5.3139399 3.5421984,5.3139399 c 0.8848811,0 1.0817892,0.5933068 1.0817892,1.6045705 0,0.4588365 -0.078229,1.7693366 0.4655187,3.0603814 C 5.6332541,11.269936 6.3225948,13.5 8,13.5 M 8,2.6 c 1.8872066,0 4.79381,0.1861509 5.461004,0.4720908 0.667194,0.2859404 1.485609,0.8985218 1.800571,1.859047 0.229196,0.6989648 0.567992,2.773817 -0.59262,2.4628318 -1.03864,-0.2783025 -1.326272,-2.0800297 -2.211153,-2.0800297 -0.884882,0 -1.08179,0.5933068 -1.08179,1.6045705 0,0.4588365 0.07823,1.7693366 -0.465518,3.0603814 C 10.366746,11.269936 9.6774052,13.5 8,13.5'
        />
        <path
            d='m 6.5,5 v 2 m 3,-2 v 2'
        />
        <path
            d='M 6.5,9 8,10.5 9.5,9'
            style={{ strokeLinecap: 'round' }}
        />
        <path
            d='M 8,10.5 V 12'
            style={{ strokeLinecap: 'round' }}
        />
    </SvgMapIcon>;
}
