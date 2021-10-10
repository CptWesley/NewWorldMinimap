import React from 'react';
import DesktopHeader from './DesktopHeader';
import Frame from './Frame';
import Minimap from './Minimap';

export default function Desktop() {
    return <Frame
        header={<DesktopHeader />}
        content={<Minimap />}
    />;
}
