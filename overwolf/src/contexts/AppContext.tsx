import React from 'react';

export type MinimapWindowType = 'desktop' | 'inGame';

export interface IAppContextData {
    showHeader: boolean;
    showToolbar: boolean;
    transparentHeader: boolean;
    transparentToolbar: boolean;
    showText: boolean;
    iconScale: number;
    zoomLevel: number;
    opacity: number;
    shape: string;
    iconSettings: IconSettings | undefined;
}

export interface IAppContext {
    value: IAppContextData;
    update: (delta: Partial<IAppContextData>) => void;
    toggleFrameMenu: () => void;
    gameRunning: boolean;
    isTransparentSurface: boolean | undefined;
    minimapWindowType: MinimapWindowType | undefined;
}

export const defaultAppContext: IAppContext = {
    value: {
        showHeader: true,
        showToolbar: false,
        transparentHeader: true,
        transparentToolbar: true,
        showText: false,
        iconScale: 1.5,
        zoomLevel: 2,
        opacity: 1,
        shape: 'inset(0%)',
        iconSettings: undefined,
    },
    update: () => { },
    toggleFrameMenu: () => { },
    gameRunning: false,
    isTransparentSurface: undefined,
    minimapWindowType: undefined,
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
