import React from 'react';
import App from './App';
import DesktopHeader from './DesktopHeader';
import Frame from './Frame';

export default function Desktop() {
    return <Frame
        header={<DesktopHeader />}
        content={<App />}
    />;
}
