import React from 'react';
import { load, SimpleStorageSettings } from '../logic/storage';

export type MinimapWindowType = 'desktop' | 'inGame';

export type AppContextSettings = SimpleStorageSettings & {
    iconSettings: IconSettings | undefined;
}

export interface IAppContext {
    settings: AppContextSettings;
    update: (delta: Partial<AppContextSettings>) => void;
    toggleFrameMenu: () => void;
    gameRunning: boolean;
    isTransparentSurface: boolean | undefined;
    minimapWindowType: MinimapWindowType | undefined;
    frameMenuVisible: boolean;
}

export const defaultAppContext: IAppContext = {
    settings: {
        showHeader: load('showHeader', true),
        showToolbar: load('showToolbar', false),
        transparentHeader: load('transparentHeader', true),
        transparentToolbar: load('transparentToolbar', true),
        showText: load('showText', false),
        iconScale: load('iconScale', 1.5),
        zoomLevel: load('zoomLevel', 2),
        opacity: load('opacity', 1),
        shape: load('shape', 'none'),
        compassMode: load('compassMode', true),
        iconSettings: undefined,
    },
    update: () => { },
    toggleFrameMenu: () => { },
    gameRunning: false,
    isTransparentSurface: undefined,
    minimapWindowType: undefined,
    frameMenuVisible: false,
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
