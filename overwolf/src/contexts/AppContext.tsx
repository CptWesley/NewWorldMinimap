import React from 'react';
import { load, simpleStorageDefaultSettings, SimpleStorageSetting } from '../logic/storage';

export type AppContextSettings = SimpleStorageSetting & {
    iconSettings: IconSettings | undefined;
}

export interface IAppContext {
    settings: AppContextSettings;
    update: (delta: Partial<AppContextSettings>) => void;
    toggleFrameMenu: () => void;
    gameRunning: boolean;
    isTransparentSurface: boolean | undefined;
    appSettingsVisible: boolean;
}

export function loadAppContextSettings(): AppContextSettings {
    return {
        showHeader: load('showHeader'),
        showToolbar: load('showToolbar'),
        transparentHeader: load('transparentHeader'),
        transparentToolbar: load('transparentToolbar'),
        showText: load('showText'),
        iconScale: load('iconScale'),
        zoomLevel: load('zoomLevel'),
        opacity: load('opacity'),
        shape: load('shape'),
        compassMode: load('compassMode'),
        iconSettings: undefined,
        townZoomLevel: load('townZoomLevel'),
        townZoom: load('townZoom'),
        interpolation: load('interpolation'),
        lastKnownPosition: load('lastKnownPosition'),
        featureCollection: load('featureCollection'),
    };
}

export const defaultAppContext: IAppContext = {
    settings: {
        ...simpleStorageDefaultSettings,
        iconSettings: undefined,
    },
    update: () => { },
    toggleFrameMenu: () => { },
    gameRunning: false,
    isTransparentSurface: undefined,
    appSettingsVisible: false,
};

export const AppContext = React.createContext<IAppContext>(defaultAppContext);
