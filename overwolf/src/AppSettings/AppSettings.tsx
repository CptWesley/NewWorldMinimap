import clsx from 'clsx';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { AppContext, AppContextSettings } from '@/contexts/AppContext';
import ReturnIcon from '@/Icons/ReturnIcon';
import SelectIcon from '@/Icons/SelectIcon';
import UnselectIcon from '@/Icons/UnselectIcon';
import { SimpleStorageSetting, store, storeIconCategory, storeIconType } from '@/logic/storage';
import { compareNames } from '@/logic/util';
import { useAppSettingsStyles } from './appSettingsStyle';
import WindowSettingsPage from './pages/WindowSettingsPage';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

export interface IAppSettingsPageProps {
    settings: AppContextSettings;
    updateSimpleSetting: <TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) => void;
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

    const rootClassName = clsx(
        classes.root,
        !visible && classes.hidden,
        context.settings.showHeader && classes.belowHeader,
        isPeeking && context.gameRunning && classes.peek);

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
                    <WindowSettingsPage
                        settings={context.settings}
                        updateSimpleSetting={updateSimpleSetting}
                        setPeek={setIsPeeking}
                    />
                </div>
            </details>
            <details>
                <summary className={classes.summary}>In-game overlay window</summary>
                <div className={classes.indent}>
                    <div className={classes.setting}>
                        <label className={classes.checkbox} title='Enabling will make the player always face north and rotates the map around the player, like a classic minimap.'>
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
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.range} title='Determines the opacity of the overlay.'>
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
                    </div>
                    <div className={classes.setting}>
                        <label className={classes.select} title='Determines the shape of the overlay.'>
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
                    </div>
                </div>
            </details>
            <details>
                <summary className={classes.summary}>Icon Categories</summary>
                <div className={classes.indent}>
                    {renderIconFilterSettings()}
                </div>
            </details>
        </div>
    </div>;
}
