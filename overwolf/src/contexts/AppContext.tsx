import React from 'react';
import { load, simpleStorageDefaultSettings, SimpleStorageSetting } from '../logic/storage';

export type AppContextSettings = SimpleStorageSetting & {
    iconSettings: IconSettings | undefined;
}

export interface IAppContext {
    settings: AppContextSettings;
    update: (delta: React.SetStateAction<Partial<AppContextSettings>>) => void;
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
        showPlayerCoordinates: load('showPlayerCoordinates'),
        iconScale: load('iconScale'),
        zoomLevel: load('zoomLevel'),
        opacity: load('opacity'),
        shape: load('shape'),
        compassMode: load('compassMode'),
        iconSettings: undefined,
        townZoomLevel: load('townZoomLevel'),
        townZoom: load('townZoom'),
        animationInterpolation: load('animationInterpolation'),
        extrapolateLocation: load('extrapolateLocation'),
        shareLocation: load('shareLocation'),
        resamplingRate: load('resamplingRate'),
        lastKnownPosition: load('lastKnownPosition'),
        channelsServerUrl: load('channelsServerUrl'),
        showNavMesh: load('showNavMesh'),
        alwaysLaunchDesktop: load('alwaysLaunchDesktop'),
        autoLaunchInGame: load('autoLaunchInGame'),
        rotationSource: load('rotationSource'),
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
