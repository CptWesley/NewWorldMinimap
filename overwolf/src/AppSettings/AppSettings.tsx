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

const settingsPageMap = {
    window: WindowSettingsPage,
    overlay: OverlaySettingsPage,
    icon: IconSettingsPage,
} as const;

const settingsPages: (keyof typeof settingsPageMap)[] = [
    'window',
    'overlay',
    'icon',
];

const settingsPageNames: Record<keyof typeof settingsPageMap, string> = {
    icon: 'Icons',
    overlay: 'In-game overlay',
    window: 'This window',
};

export default function AppSettings(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useAppSettingsStyles();

    const [currentPage, setCurrentPage] = useState(settingsPages[0]);
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

    const PageComponent = settingsPageMap[currentPage];

    return <div className={rootClassName}>
        <button className={classes.return} onClick={onClose}>
            <ReturnIcon />
        </button>
        <h2 className={classes.title}>Options</h2>
        <nav className={classes.nav}>
            {settingsPages.map(p =>
                <button
                    className={clsx(classes.navItem, p === currentPage && classes.navItemActive)}
                    onClick={() => setCurrentPage(p)}
                >
                    {settingsPageNames[p]}
                </button>
            )}
        </nav>
        <div className={classes.content}>
            <PageComponent {...pageProps} />
        </div>
        <footer className={classes.footer}>
            Open this menu at any time by right-clicking in the application.
        </footer>
    </div>;
}
