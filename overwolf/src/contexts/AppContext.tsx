import React from 'react';
import { getDefaultIconSettings } from '../logic/markers';

export interface IAppContextData {
    showHeader: boolean;
    showToolbar: boolean;
    transparentHeader: boolean;
    transparentToolbar: boolean;
    iconScale: number;
    zoomLevel: number;
    shape: string;
    iconSettings: IconSettings;
}

export interface IAppContext {
    value: IAppContextData;
    update: (delta: Partial<IAppContextData>) => void;
    toggleFrameMenu: () => void;
}

export const defaultAppContext: IAppContext = {
    value: {
        showHeader: true,
        showToolbar: false,
        transparentHeader: true,
        transparentToolbar: true,
        iconScale: 1.5,
        zoomLevel: 2,
        shape: 'inset(0%)',
        iconSettings: getDefaultIconSettings(),
    },
    update: () => { },
    toggleFrameMenu: () => { },
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
