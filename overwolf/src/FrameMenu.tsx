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
        overflowY: 'auto',
        maxHeight: '100%',

        '&::-webkit-scrollbar': {
            width: '10px',
        },

        '&::-webkit-scrollbar-thumb': {
            background: theme.scrollbarColor,
        },
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
    indent: {
        marginLeft: '20px',
    },
    indent2: {
        marginLeft: '30px',
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
                        value={context.value.opacity}
                        min='0.1'
                        max='1'
                        step='0.05'
                        onChange={e => context.update({ opacity: e.currentTarget.valueAsNumber })}
                    />
                    Overlay Opacity
                </label>
            </p>
            <p>
                <label className={classes.select}>
                    <select
                        value={context.value.shape}
                        onChange={e => context.update({ shape: e.currentTarget.value })}
                    >
                        <option value='none'>Rectangular</option>
                        <option value='ellipse(50% 50%)'>Ellipse</option>
                        <option value='polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'>Diamond</option>
                    </select>
                    Overlay Shape
                </label>
            </p>
            <p>
                <label className={classes.range}>
                    <input
                        type='range'
                        value={7 - context.value.zoomLevel}
                        min='0'
                        max='6.5'
                        step='0.1'
                        onChange={e => context.update({ zoomLevel: 7 - e.currentTarget.valueAsNumber })}
                    />
                    Zoom Level
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
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.showText}
                        onChange={e => context.update({ showText: e.currentTarget.checked })}
                    />
                    Show text
                </label>
            </p>
            <span>
                <details>
                    <summary>Icon Categories</summary>
                    <div className={classes.indent}>
                        {iconSettings}
                    </div>
                </details>
            </span>
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

        const typeChildren: JSX.Element[] = [];

        for (const [typeKey, typeValue] of Object.entries(cat.types)) {
            const type = typeValue as IconSetting;

            const typeElement =
                <p key={'FrameMenuType' + typeKey}>
                    <label className={classes.checkbox}>
                        <input
                            type='checkbox'
                            checked={type.value}
                            onChange={e => context.update({ iconSettings: updateIconSettings(settings, key, typeKey, e.currentTarget.checked) })}
                        />
                        {type.name}
                    </label>
                </p>;

            typeChildren.push(typeElement);
        }

        const element =
            <span key={'FrameMenuCat' + key}>
                <details>
                    <summary>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={cat.value}
                                onChange={e => context.update({ iconSettings: updateIconCategorySettings(settings, key, e.currentTarget.checked) })}
                            />
                            {cat.name}
                        </label>
                    </summary>
                    <div className={classes.indent2}>
                        {typeChildren}
                    </div>
                </details>
            </span>;

        children.push(element);
    }

    return <div>{children}</div>;
}

function updateIconCategorySettings(settings: IconSettings, name: string, value: boolean) {
    settings.categories[name].value = value;
    return settings;
}

function updateIconSettings(settings: IconSettings, catName: string, name: string, value: boolean) {
    settings.categories[catName].types[name].value = value;
    return settings;
}
