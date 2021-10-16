import React from 'react';
import Frame from './Frame';
import InGameHeader from './InGameHeader';

export default function Desktop() {
    return <Frame
        header={<InGameHeader />}
        isTransparentSurface
    />;
}
