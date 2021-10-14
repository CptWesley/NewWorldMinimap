import clsx from 'clsx';
import produce from 'immer';
import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
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
    summary: {
        outline: 'none',
        borderRadius: 3,
        padding: 2,

        '&:hover': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.33)',
        },

        '&:focus': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.15)',
        },
    },
    indent: {
        marginLeft: '20px',
    },
    indent2: {
        marginLeft: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
}));

export default function FrameMenu(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    function updateIconCategorySettings(name: string, value: boolean) {
        const settings = context.value.iconSettings;
        if (settings) {
            return produce(settings, draft => {
                draft.categories[name].value = value;
            });
        }
        return settings;
    }

    function updateIconSettings(catName: string, name: string, value: boolean) {
        const settings = context.value.iconSettings;
        if (settings) {
            return produce(settings, draft => {
                draft.categories[catName].types[name].value = value;
            });
        }
        return settings;
    }

    function renderIconFilterSettings() {
        if (!context.value.iconSettings) {
            return null;
        }

        return Object.entries(context.value.iconSettings.categories).map(([categoryKey, category]) => {
            const typeChildren = Object.entries(category.types).map(([typeKey, type]) => {
                return <p key={'FrameMenuType' + typeKey}>
                    <label className={classes.checkbox}>
                        <input
                            type='checkbox'
                            checked={type.value}
                            onChange={e => context.update({ iconSettings: updateIconSettings(categoryKey, typeKey, e.currentTarget.checked) })}
                        />
                        {type.name}
                    </label>
                </p>;
            });

            return <details key={'FrameMenuCat' + categoryKey}>
                <summary className={classes.summary}>
                    <label className={classes.checkbox}>
                        <input
                            type='checkbox'
                            checked={category.value}
                            onChange={e => context.update({ iconSettings: updateIconCategorySettings(categoryKey, e.currentTarget.checked) })}
                        />
                        {category.name}
                    </label>
                </summary>
                <div className={classes.indent2}>
                    {typeChildren}
                </div>
            </details>;
        });
    }

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
            <details>
                <summary className={classes.summary}>Icon Categories</summary>
                <div className={classes.indent}>
                    {renderIconFilterSettings()}
                </div>
            </details>
        </div>
    </div>;
}
