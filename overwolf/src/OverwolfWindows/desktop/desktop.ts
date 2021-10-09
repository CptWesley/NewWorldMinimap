import React from 'react';
import ReactDOM from 'react-dom';
import Desktop from '../../Desktop';

export const desktopAppTitle = `${NWMM_APP_NAME} ${NWMM_APP_VERSION}`;
document.title = desktopAppTitle;

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.render(React.createElement(Desktop), rootElement);
}
