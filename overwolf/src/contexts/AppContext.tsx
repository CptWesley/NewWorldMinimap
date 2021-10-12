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
}

export const defaultAppContext: IAppContext = {
    value: {
        showHeader: true,
        showToolbar: true,
        transparentHeader: true,
        transparentToolbar: true,
    },
    update: () => { },
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
