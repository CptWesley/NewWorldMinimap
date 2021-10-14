import React from 'react';
import ReactDOM from 'react-dom';
import InGameComponent from '../../InGame';

export const inGameAppTitle = `${NWMM_APP_NAME}`;
document.title = inGameAppTitle;

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.render(React.createElement(InGameComponent), rootElement);
}
