import React from 'react';

export interface IAppContextData {
    showHeader: boolean;
    showToolbar: boolean;
    transparentHeader: boolean;
    transparentToolbar: boolean;
}

export interface IAppContext {
    value: IAppContextData;
    update: (delta: Partial<IAppContextData>) => void;
    toggleFrameMenu: () => void;
}

export const defaultAppContext: IAppContext = {
    value: {
        showHeader: true,
        showToolbar: true,
        transparentHeader: true,
        transparentToolbar: true,
    },
    update: () => { },
    toggleFrameMenu: () => { },
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
