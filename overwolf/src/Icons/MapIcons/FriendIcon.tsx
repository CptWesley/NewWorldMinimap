import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function FriendIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <circle cx='8' cy='8' r='4' />
    </SvgMapIcon>;
}
