import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import { AppWindow } from '../AppWindow';
import { windowNames } from '../consts';

// The desktop window is the window displayed while Portal 2 is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
new AppWindow(windowNames.desktop);

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.render(React.createElement(App), rootElement);
}
