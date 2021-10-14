import React from 'react';
import { load } from '../logic/storage';

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
        showHeader: load('showHeader', true),
        showToolbar: load('showToolbar', false),
        transparentHeader: load('transparentHeader', true),
        transparentToolbar: load('transparentToolbar', true),
        showText: load('showText', false),
        iconScale: load('iconScale', 1.5),
        zoomLevel: load('zoomLevel', 2),
        opacity: load('opacity', 1),
        shape: load('shape', 'none'),
        iconSettings: undefined,
    },
    update: () => { },
    toggleFrameMenu: () => { },
    gameRunning: false,
    isTransparentSurface: undefined,
    minimapWindowType: undefined,
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
