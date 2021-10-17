import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { AppContext, AppContextSettings, IAppContext } from '@/contexts/AppContext';
import ReturnIcon from '@/Icons/ReturnIcon';
import { SimpleStorageSetting, store } from '@/logic/storage';
import { useAppSettingsStyles } from './appSettingsStyle';
import IconSettingsPage from './pages/IconSettingsPage';
import OverlaySettingsPage from './pages/OverlaySettingsPage';
import WindowSettingsPage from './pages/WindowSettingsPage';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

export interface IAppSettingsPageProps {
    settings: AppContextSettings;
    updateSimpleSetting: <TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) => void;
    updateSettings: IAppContext['update']
    setPeek: (peek: boolean) => void;
}

export default function AppSettings(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useAppSettingsStyles();

    const [isPeeking, setIsPeeking] = useState(false);

    function updateSimpleSetting<TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) {
        store(key, value);
        context.update({ [key]: value });
    }

    const rootClassName = clsx(
        classes.root,
        !visible && classes.hidden,
        context.settings.showHeader && classes.belowHeader,
        isPeeking && context.gameRunning && classes.peek);

    const pageProps: IAppSettingsPageProps = {
        settings: context.settings,
        updateSimpleSetting,
        updateSettings: context.update,
        setPeek: setIsPeeking,
    };

    return <div className={rootClassName}>
        <button className={classes.return} onClick={onClose}>
            <ReturnIcon />
        </button>
        <h2 className={classes.title}>Options</h2>
        <span className={classes.footer}>Open this menu at any time by right-clicking in the application.</span>
        <div className={classes.content}>
            <details>
                <summary className={classes.summary}>This window</summary>
                <div className={classes.indent}>
                    <WindowSettingsPage {...pageProps} />
                </div>
            </details>
            <details>
                <summary className={classes.summary}>In-game overlay window</summary>
                <div className={classes.indent}>
                    <OverlaySettingsPage {...pageProps} />
                </div>
            </details>
            <details>
                <summary className={classes.summary}>Icon Categories</summary>
                <div className={classes.indent}>
                    <IconSettingsPage {...pageProps} />
                </div>
            </details>
        </div>
    </div>;
}
