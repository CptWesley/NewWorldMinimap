import React from 'react';
import App from './App';
import Frame from './Frame';
import InGameHeader from './InGameHeader';

export default function Desktop() {
    return <Frame
        header={<InGameHeader />}
        content={<App />}
        isTransparentSurface
    />;
}
