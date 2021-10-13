import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext, IAppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import ReturnIcon from './Icons/ReturnIcon';
import { makeStyles } from './theme';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'grid',
        padding: theme.spacing(2),
        gap: theme.spacing(2),
        gridTemplateRows: '40px 1fr auto',
        gridTemplateColumns: '40px 1fr',
        gridTemplateAreas: '"return title" ". content" ". footer"',

        background: theme.frameMenuBackground,
        color: theme.frameMenuColor,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.frameMenu,
        backdropFilter: 'blur(10px)',
    },
    hidden: {
        display: 'none !important',
    },
    return: {
        background: 'transparent',
        border: 'none',
        color: theme.frameMenuColor,
        padding: 0,

        '&:focus': {
            outline: `1px solid ${theme.frameMenuColor}`,
        },
    },
    title: {
        gridArea: 'title',
        alignSelf: 'center',
        fontSize: 18,
    },
    content: {
        gridArea: 'content',
    },
    footer: {
        gridArea: 'footer',
    },
    checkbox: {
        '& > input[type="checkbox"]': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
    range: {
        '& > input[type="range"]': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
    select: {
        '& > select': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
}));

export default function FrameMenu(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();
    const iconSettings = getIconSettingsMenu(context, classes, context.value.iconSettings);

    return <div className={clsx(classes.root, !visible && classes.hidden)}>
        <button className={classes.return} onClick={onClose}>
            <ReturnIcon />
        </button>
        <h2 className={classes.title}>Options</h2>
        <span className={classes.footer}>Open this menu at any time by right-clicking in the application.</span>
        <div className={classes.content}>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.transparentHeader}
                        onChange={e => context.update({ transparentHeader: e.currentTarget.checked })}
                    />
                    Transparent header
                </label>
            </p>
            <p hidden>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.transparentToolbar}
                        onChange={e => context.update({ transparentToolbar: e.currentTarget.checked })}
                    />
                    Transparent toolbar
                </label>
            </p>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.showHeader}
                        onChange={e => context.update({ showHeader: e.currentTarget.checked })}
                    />
                    Show header
                </label>
            </p>
            <p hidden>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.showToolbar}
                        onChange={e => context.update({ showToolbar: e.currentTarget.checked })}
                    />
                    Show toolbar
                </label>
            </p>
            <p>
                <label className={classes.range}>
                    <input
                        type='range'
                        value={context.value.iconScale}
                        min='0.5'
                        max='5'
                        step='0.1'
                        onChange={e => context.update({ iconScale: e.currentTarget.valueAsNumber })}
                    />
                    Icon Scale
                </label>
            </p>
            <p>
                <label className={classes.range}>
                    <input
                        type='range'
                        value={4 - context.value.zoomLevel}
                        min='0'
                        max='3'
                        step='0.1'
                        onChange={e => context.update({ zoomLevel: 4 - e.currentTarget.valueAsNumber })}
                    />
                    Zoom Level
                </label>
            </p>
            <p hidden>
                <label className={classes.select}>
                    <select
                        value={context.value.shape}
                        onChange={e => context.update({ shape: e.currentTarget.value })}
                    >
                        <option value='inset(0%)'>Rectangular</option>
                        <option value='ellipse(50% 50%)'>Ellipse</option>
                        <option value='polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'>Diamond</option>
                    </select>
                    Shape
                </label>
            </p>
            <p>
                Icon Categories
                {iconSettings}
            </p>
        </div>
    </div>;
}

function getIconSettingsMenu(context: IAppContext, classes: any, settings: IconSettings | undefined) {
    if (!settings) {
        return <div></div>;
    }

    const children: JSX.Element[] = [];

    for (const [key, value] of Object.entries(settings.categories)) {
        const cat = value as IconCategorySetting;

        const element =
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={cat.value}
                        onChange={e => context.update({ iconSettings: updateIconCategorySettings(settings, key, e.currentTarget.checked) })}
                    />
                    {cat.name}
                </label>
            </p>;

        children.push(element);
    }

    return <div>{children}</div>;
}

function updateIconCategorySettings(settings: IconSettings, name: string, value: boolean) {
    settings.categories[name].value = value;
    return settings;
}
