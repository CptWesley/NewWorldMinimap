import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { keyframes } from 'tss-react';
import { AppContext } from './contexts/AppContext';
import CompassIcon from './Icons/CompassIcon';
import DestinationIcon from './Icons/DestinationIcon';
import DragIcon from './Icons/DragIcon';
import RecenterIcon from './Icons/RecenterIcon';
import ZoomInIcon from './Icons/ZoomInIcon';
import ZoomOutIcon from './Icons/ZoomOutIcon';
import MinimapToolbar from './MinimapToolbar';
import MinimapToolbarIconButton from './MinimapToolbarIconButton';
import { makeStyles } from './theme';

export type MinimapInteractionMode = 'drag' | 'destination';
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
        },
        mapControls: {
            position: 'absolute',
            right: theme.spacing(1),
            bottom: theme.spacing(1),
        },
        recenter: {
            animation: `300ms ease ${showRecenterButton}`,
            display: 'flex',
            alignItems: 'center',
            '& > svg': {
                width: '100%',
            },
        },
        separator: {
            background: theme.buttonBackgroundHover,
            flexBasis: 1,
            margin: theme.spacing(0.5),
            alignSelf: 'stretch',
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

    const separator = <div className={classes.separator} />;

    return <>
        <MinimapToolbar className={classes.mapToolbar} hidden={!appContext.settings.showToolbar}>
            <MinimapToolbarIconButton
                isSelected={interactionMode === 'drag'}
                onClick={() => setInteractionMode('drag')}
                title={t('minimap.mode_drag')}
            >
                <DragIcon />
            </MinimapToolbarIconButton>
            <MinimapToolbarIconButton
                isSelected={interactionMode === 'destination'}
                onClick={() => setInteractionMode('destination')}
                title={t('minimap.mode_destination')}
            >
                <DestinationIcon />
            </MinimapToolbarIconButton>
            {separator}
            <MinimapToolbarIconButton
                isSelected={appContext.settings.compassMode}
                onClick={() => appContext.update({ compassMode: !appContext.settings.compassMode })}
                title={t('minimap.compassMode')}
            >
                <CompassIcon />
            </MinimapToolbarIconButton>
        </MinimapToolbar>
        <MinimapToolbar
            className={classes.mapControls}
            hidden={!(appContext.settings.showToolbar || isMapDragged)}
        >
            <MinimapToolbarIconButton
                onClick={onRecenterMap}
                title={t('minimap.recenter')}
                hidden={!isMapDragged}
            >
                <RecenterIcon />
            </MinimapToolbarIconButton>
            <MinimapToolbarIconButton
                onClick={() => zoomBy(getZoomLevel() / 5)}
                title={t('minimap.zoomOut')}
                hidden={!appContext.settings.showToolbar}
            >
                <ZoomOutIcon />
            </MinimapToolbarIconButton>
            <MinimapToolbarIconButton
                onClick={() => zoomBy(getZoomLevel() / -5)}
                title={t('minimap.zoomIn')}
                hidden={!appContext.settings.showToolbar}
            >
                <ZoomInIcon />
            </MinimapToolbarIconButton>
        </MinimapToolbar>
    </>;
}
