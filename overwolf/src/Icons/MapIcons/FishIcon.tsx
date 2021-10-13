import React from 'react';
import SvgMapIcon, { getSvgMapIconProps, ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function FishIcon(props: ISvgMapIconConsumerProps) {
    const {
        stroke,
    } = getSvgMapIconProps(props);

    return <SvgMapIcon {...props}>
        <path
            d='m 14.151019,10.47394 c 0,0 -0.08876,-2.9562989 -1.29444,-5.6690129 -1.205677,-2.712714 -1.117147,-4.039381 -1.117147,-4.039381 0,0 -1.259534,4.3752233 -3.1377858,4.6845825'
            style={{ strokeLinejoin: 'round' }}
        />
        <path
            d='M 6.7838057,12.683728 C 3.636002,9.5777531 4.9632214,6.7579079 3.667006,5.3642305 2.3707906,3.9705531 0.57452426,3.7786019 0.57452426,3.7786019 L 4.3310291,0.55242718 c 0,0 -0.3529501,1.62556192 1.051,3.17235802 1.4039501,1.5467961 4.6953109,1.225603 7.3027669,3.8551565 2.607456,2.6295533 3.194549,6.1684943 2.248913,7.2432813 -0.945636,1.074788 -5.0020996,0.96648 -8.1499033,-2.139495 z'
        />
        <circle
            r='1'
            cy='13'
            cx='13'
            style={{ fill: stroke, stroke: 'none' }}
        />
        <path
            d='M 7.2699416,7.4467183 C 7.2478445,9.1702911 8.8388347,10.871767 10.893864,10.474019'
            style={{ strokeLinecap: 'round' }}
        />
    </SvgMapIcon>;
}
