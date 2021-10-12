import React from 'react';

export interface IAppContextData {
    allowTransparentHeader: boolean;
    showHeader: boolean;
    showToolbar: boolean;
}

export interface IAppContext {
    value: IAppContextData;
    update: (delta: Partial<IAppContextData>) => void;
}

export const defaultAppContext: IAppContext = {
    value: {
        allowTransparentHeader: true,
        showHeader: true,
        showToolbar: true,
    },
    update: () => { },
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
