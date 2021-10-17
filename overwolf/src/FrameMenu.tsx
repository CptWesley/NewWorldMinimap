import clsx from 'clsx';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { CSSObject } from 'tss-react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import GenerateIcon from './Icons/GenerateIcon';
import ReturnIcon from './Icons/ReturnIcon';
import SelectIcon from './Icons/SelectIcon';
import UnselectIcon from './Icons/UnselectIcon';
import { Interpolation, SimpleStorageSetting, store, storeIconCategory, storeIconType, zoomLevelSettingBounds } from './logic/storage';
import { compareNames, generateRandomToken } from './logic/util';
import { makeStyles } from './theme';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const useStyles = makeStyles()((theme, params, createRef) => {

    const hoverText: CSSObject = {
        ref: createRef(),
        visibility: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        color: 'rgba(255, 255, 255, 0.75)',
        textAlign: 'center',
        padding: '2px 3px',
        borderRadius: '4px',
        position: 'absolute',
        zIndex: 1,
        marginLeft: '10px',
    };

    return {
        root: {
            display: 'grid',
            padding: theme.spacing(2),
            gap: theme.spacing(1),
            gridTemplateRows: '30px 1fr auto',
            gridTemplateColumns: '1fr 30px',
            gridTemplateAreas: '"title return" "content content" "footer footer"',

            background: theme.frameMenuBackground,
            color: theme.frameMenuColor,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: globalLayers.frameMenu,
            backdropFilter: 'blur(10px)',
            transition: 'backdrop-filter 300ms ease, background 300ms ease',
        },
        belowHeader: {
            marginTop: theme.headerHeight,
        },
        hidden: {
            display: 'none !important',
        },
        peek: {
            background: theme.frameMenuBackgroundPeek,
            backdropFilter: 'none',
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
        selectIcon: {
            background: 'transparent',
            border: 'none',
            color: theme.frameMenuColor,
            padding: 0,
            width: 18,
            height: 18,

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

            '& > details:not(:last-child)': {
                marginBottom: theme.spacing(1),
            },

            '& > details > summary': {
                fontSize: 16,
            },
        },
        footer: {
            gridArea: 'footer',
        },
        setting: {
            marginTop: theme.spacing(1),
            position: 'relative',
            [`&:hover .${hoverText.ref}`]: {
                visibility: 'visible',
            },
        },
        textbox: {
            '& > input[type="text"]': {
                margin: theme.spacing(0, 1, 0, 0),
            },
        },
        textarea: {
            display: 'flex',
            '& > textarea': {
                minWidth: 170,
                maxWidth: 170,
                minHeight: '4em',
                width: '100%',
                margin: theme.spacing(0, 1, 0, 0),
            },
            [`& > .${hoverText.ref}`]: {
                marginLeft: 183,
                marginTop: 25,
            },
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
        hoverText,
        select: {
            '& > select': {
                margin: theme.spacing(0, 1, 0, 0),
            },
        },
        summary: {
            outline: 'none',
            borderRadius: 3,
            padding: 2,

            '&:focus': {
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
            },

            '&:hover': {
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.33)',
            },
        },
        iconCategory: {
            display: 'flex',
            alignItems: 'center',

            '& > span': {
                flexGrow: 1,
            },
        },
        indent: {
            marginLeft: 19,
        },
        iconTypeContainer: {
            margin: theme.spacing(0, 0, 1, 3),
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        },
        friendsGenerateButton: {
            background: 'transparent',
            border: 'none',
            color: theme.frameMenuColor,
            padding: 0,
            margin: '0 2px',
            width: 20,
            height: 20,
            verticalAlign: 'middle',

            '&:focus': {
                outline: 0,
            },
        },
    };
}
);

export default function FrameMenu(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    const [isDraggingMapSlider, setIsDraggingMapSlider] = useState(false);

    function updateIconCategorySettings(name: string, value: boolean) {
        const settings = context.settings.iconSettings;
        storeIconCategory(name, value);
        if (settings) {
            return produce(settings, draft => {
                draft.categories[name].value = value;
            });
        }
        return settings;
    }

    function updateSimpleSetting<TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) {
        store(key, value);
        context.update({ [key]: value });
    }

    function updateIconSettings(category: string, type: string, value: boolean) {
        const settings = context.settings.iconSettings;
        storeIconType(category, type, value);
        if (settings) {
            return produce(settings, draft => {
                draft.categories[category].types[type].value = value;
            });
        }
        return settings;
    }

    function selectAllIconsByCategory(category: string, value: boolean) {
        const settings = context.settings.iconSettings;
        if (settings) {
            return produce(settings, draft => {
                storeIconCategory(category, value);
                draft.categories[category].value = value;
                for (const type in draft.categories[category].types) {
                    draft.categories[category].types[type].value = value;
                    storeIconType(category, type, value);
                }
            });
        }
        return settings;
    }

    function renderIconFilterSettings() {
        if (!context.settings.iconSettings) {
            return null;
        }

        return Object.entries(context.settings.iconSettings.categories).sort(compareNames).map(([categoryKey, category]) => {
            const typeChildren = Object.entries(category.types).sort(compareNames).map(([typeKey, type]) => {
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
                <summary className={clsx(classes.summary, classes.iconCategory)}>
                    <label className={classes.checkbox}>
                        <input
                            type='checkbox'
                            checked={category.value}
                            onChange={e => context.update({ iconSettings: updateIconCategorySettings(categoryKey, e.currentTarget.checked) })}
                        />
                        {category.name}
                    </label>
                    <span />
                    <button className={classes.selectIcon} onClick={() => context.update({ iconSettings: selectAllIconsByCategory(categoryKey, true) })}>
                        <SelectIcon />
                    </button>
                    <button className={classes.selectIcon} onClick={() => context.update({ iconSettings: selectAllIconsByCategory(categoryKey, false) })}>
                        <UnselectIcon />
                    </button>
                </summary>
                <div className={classes.iconTypeContainer}>
                    {typeChildren}
                </div>
            </details>;
        });
    }

    function handleMapSliderMouseDown() {
        setIsDraggingMapSlider(true);
    }

    function handleMapSliderMouseUp() {
        setIsDraggingMapSlider(false);
    }

    const rootClassName = clsx(
        classes.root,
        !visible && classes.hidden,
        context.settings.showHeader && classes.belowHeader,
        isDraggingMapSlider && context.gameRunning && classes.peek);

    function renderFriendsSettings() {
        if (process.env.ENABLE_FRIENDS !== 'true') {
            return null;
        }
        return <details>
            <summary className={classes.summary}>Friends</summary>
            <div className={classes.indent}>
                <div className={classes.setting}>
                    <label className={classes.checkbox}>
                        <input
                            type='checkbox'
                            checked={context.settings.shareLocation}
                            onChange={e => updateSimpleSetting('shareLocation', e.currentTarget.checked)}
                        />
                        Share location with friends
                        <span className={classes.hoverText}>Share your location with any player that have your code.</span>
                    </label>
                </div>
                <div className={classes.setting}>
                    <label className={classes.textbox}>
                        <input
                            type='text'
                            readOnly
                            value={context.settings.friendCode}
                        />
                        Your code
                        <button className={classes.friendsGenerateButton} onClick={() => updateSimpleSetting('friendCode', generateRandomToken())}>
                            <GenerateIcon />
                        </button>
                        <span className={classes.hoverText}>Send this code to your friends to share your location.</span>
                    </label>
                </div>
                <div className={classes.setting}>
                    <label className={classes.textarea}>
                        <textarea
                            value={context.settings.friends}
                            onChange={e => updateSimpleSetting('friends', e.currentTarget.value)}
                        />
                        Friends
                        <span className={classes.hoverText}>List of friend codes one per line.</span>
                    </label>
                </div>
            </div>
        </details>;
    }

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
                    <div className={classes.setting}>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.transparentHeader}
                                onChange={e => updateSimpleSetting('transparentHeader', e.currentTarget.checked)}
                            />
                            Transparent header
                        </label>
                        <span className={classes.hoverText}>Enabling will make the window header transparent.</span>
                    </div>
                    <div className={classes.setting} hidden>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.transparentToolbar}
                                onChange={e => updateSimpleSetting('transparentToolbar', e.currentTarget.checked)}
                            />
                            Transparent toolbar
                        </label>
                        <span className={classes.hoverText}>Enabling will make the toolbar transparent.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.showHeader}
                                onChange={e => updateSimpleSetting('showHeader', e.currentTarget.checked)}
                            />
                            Show header
                        </label>
                        <span className={classes.hoverText}>Enabling will show the header text and buttons.</span>
                    </div>
                    <div className={classes.setting} hidden>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.showToolbar}
                                onChange={e => updateSimpleSetting('showToolbar', e.currentTarget.checked)}
                            />
                            Show toolbar
                        </label>
                        <span className={classes.hoverText}>Enabling will show the toolbar.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.range}>
                            <input
                                type='range'
                                value={zoomLevelSettingBounds[1] - context.settings.zoomLevel}
                                min='0'
                                max={zoomLevelSettingBounds[1] - zoomLevelSettingBounds[0]}
                                step='0.1'
                                onChange={e => {
                                    const newValue = zoomLevelSettingBounds[1] - e.currentTarget.valueAsNumber;
                                    updateSimpleSetting('zoomLevel', newValue);
                                }}
                                onMouseDown={handleMapSliderMouseDown}
                                onMouseUp={handleMapSliderMouseUp}
                            />
                            Zoom Level
                        </label>
                        <span className={classes.hoverText}>Determines the zoom level on the map. Lower zoom may impact performance.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.townZoom}
                                onChange={e => updateSimpleSetting('townZoom', e.currentTarget.checked)}
                            />
                            Different Zoom In Towns
                        </label>
                        <span className={classes.hoverText}>Enabling will allow you to configure a seperate zoom level when in towns.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.range}>
                            <input
                                type='range'
                                value={zoomLevelSettingBounds[1] - context.settings.townZoomLevel}
                                min='0'
                                max={zoomLevelSettingBounds[1] - zoomLevelSettingBounds[0]}
                                step='0.1'
                                disabled={!context.settings.townZoom}
                                onChange={e => {
                                    const newValue = zoomLevelSettingBounds[1] - e.currentTarget.valueAsNumber;
                                    updateSimpleSetting('townZoomLevel', newValue);
                                }}
                                onMouseDown={handleMapSliderMouseDown}
                                onMouseUp={handleMapSliderMouseUp}
                            />
                            Town Zoom Level
                        </label>
                        <span className={classes.hoverText}>Determines the zoom level on the map when in towns. Lower zoom may impact performance.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.range}>
                            <input
                                type='range'
                                value={context.settings.iconScale}
                                min='0.5'
                                max='5'
                                step='0.1'
                                onChange={e => updateSimpleSetting('iconScale', e.currentTarget.valueAsNumber)}
                                onMouseDown={handleMapSliderMouseDown}
                                onMouseUp={handleMapSliderMouseUp}
                            />
                            Icon Scale
                        </label>
                        <span className={classes.hoverText}>Determines the size of the rendered icons.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.showText}
                                onChange={e => updateSimpleSetting('showText', e.currentTarget.checked)}
                            />
                            Show text
                        </label>
                        <span className={classes.hoverText}>Enabling adds text underneath icons on the map. Enabling may impact performance.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.select}>
                            <select
                                value={context.settings.interpolation}
                                onChange={e => updateSimpleSetting('interpolation', e.currentTarget.value as Interpolation)}
                            >
                                <option value='none'>None</option>
                                <option value='linear-interpolation'>Linear Interpolation</option>
                                <option value='cosine-interpolation'>Cosine Interpolation</option>
                                <option value='linear-extrapolation'>Linear Extrapolation</option>
                                <option value='cosine-extrapolation'>Cosine Extrapolation</option>
                            </select>
                            Location (Inter/Extra)polation
                        </label>
                        <span className={classes.hoverText}>Detemines which algorithm to use to produce smoother movement around the map. Interpolation gives smoothest results, but adds a delay to your position. None gives the best performance.</span>
                    </div>
                </div>
            </details>
            <details>
                <summary className={classes.summary}>In-game overlay window</summary>
                <div className={classes.indent}>
                    <div className={classes.setting}>
                        <label className={classes.checkbox}>
                            <input
                                type='checkbox'
                                checked={context.settings.compassMode}
                                onChange={e => {
                                    store('compassMode', e.currentTarget.checked);
                                    context.update({ compassMode: e.currentTarget.checked });
                                }}
                            />
                            Overlay Compass Mode
                        </label>
                        <span className={classes.hoverText}>Enabling will make the player always face north and rotates the map around the player, like a classic minimap.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.range}>
                            <input
                                type='range'
                                value={context.settings.opacity}
                                min='0.1'
                                max='1'
                                step='0.05'
                                onChange={e => updateSimpleSetting('opacity', e.currentTarget.valueAsNumber)}
                            />
                            Overlay Opacity
                        </label>
                        <span className={classes.hoverText}>Determines the opacity of the overlay.</span>
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.select}>
                            <select
                                value={context.settings.shape}
                                onChange={e => updateSimpleSetting('shape', e.currentTarget.value)}
                            >
                                <option value='none'>Rectangular</option>
                                <option value='ellipse(50% 50%)'>Ellipse</option>
                                <option value='polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'>Diamond</option>
                            </select>
                            Overlay Shape
                        </label>
                        <span className={classes.hoverText}>Determines the shape of the overlay.</span>
                    </div>
                </div>
            </details>
            {renderFriendsSettings()}
            <details>
                <summary className={classes.summary}>Icon Categories</summary>
                <div className={classes.indent}>
                    {renderIconFilterSettings()}
                </div>
            </details>
        </div>
    </div>;
}
