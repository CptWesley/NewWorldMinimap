import React from 'react';
import DesktopHeader from './DesktopHeader';
import Frame from './Frame';

export default function Desktop() {
    return <Frame
        header={<DesktopHeader />}
        minimapWindowType='desktop'
    />;
}
