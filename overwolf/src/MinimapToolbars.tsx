import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { keyframes } from 'tss-react';
import { AppContext } from './contexts/AppContext';
import DragIcon from './Icons/DragIcon';
import NavigationIcon from './Icons/NavigationIcon';
import RecenterIcon from './Icons/RecenterIcon';
import ZoomInIcon from './Icons/ZoomInIcon';
import ZoomOutIcon from './Icons/ZoomOutIcon';
import MinimapToolbar from './MinimapToolbar';
import MinimapToolbarIconButton from './MinimapToolbarIconButton';
import { makeStyles } from './theme';

export type MinimapInteractionMode = 'drag' | 'navigate';
interface IProps {
    interactionMode: MinimapInteractionMode;
    setInteractionMode: (mode: MinimapInteractionMode) => void;
    zoomBy: (delta: number) => void;
    getZoomLevel: () => number;
    isMapDragged: boolean;
    onRecenterMap: () => void;
}

const showRecenterButton = keyframes({
    from: {
        width: 0,
        padding: 0,
    },
    to: {
        width: 40,
        padding: 5,
    },
});

const useStyles = makeStyles()(theme => {
    return {
        mapToolbar: {
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            display: 'flex',
            flexDirection: 'row',
        },
        mapControls: {
            position: 'absolute',
            right: theme.spacing(1),
            bottom: theme.spacing(1),
            display: 'flex',
            flexDirection: 'row-reverse',
        },
        recenter: {
            animation: `300ms ease ${showRecenterButton}`,
            display: 'flex',
            alignItems: 'center',
            '& > svg': {
                width: '100%',
            },
        },
    };
});

export default function MinimapToolbars(props: IProps) {
    const {
        interactionMode,
        setInteractionMode,
        zoomBy,
        getZoomLevel,
        isMapDragged,
        onRecenterMap,
    } = props;
    const appContext = useContext(AppContext);
    const { classes } = useStyles();
    const { t } = useTranslation();

    return <>
        {appContext.settings.showToolbar &&
            <MinimapToolbar className={classes.mapToolbar}>
                <MinimapToolbarIconButton
                    isSelected={interactionMode === 'drag'}
                    onClick={() => setInteractionMode('drag')}
                    title={t('minimap.mode_drag')}
                >
                    <DragIcon />
                </MinimapToolbarIconButton>
                <MinimapToolbarIconButton
                    isSelected={interactionMode === 'navigate'}
                    onClick={() => setInteractionMode('navigate')}
                    title={t('minimap.mode_navigate')}
                >
                    <NavigationIcon />
                </MinimapToolbarIconButton>
            </MinimapToolbar>
        }
        {NWMM_APP_WINDOW === 'desktop' &&
            <MinimapToolbar className={classes.mapControls}>
                <MinimapToolbarIconButton onClick={() => zoomBy(getZoomLevel() / -5)} title={t('minimap.zoomIn')}>
                    <ZoomInIcon />
                </MinimapToolbarIconButton>
                <MinimapToolbarIconButton onClick={() => zoomBy(getZoomLevel() / 5)} title={t('minimap.zoomOut')}>
                    <ZoomOutIcon />
                </MinimapToolbarIconButton>
                {isMapDragged && <MinimapToolbarIconButton className={classes.recenter} onClick={onRecenterMap} title={t('minimap.recenter')}>
                    <RecenterIcon />
                </MinimapToolbarIconButton>}
            </MinimapToolbar>
        }
    </>;
}
