import clsx from 'clsx';
import produce from 'immer';
import React from 'react';
import SelectIcon from '@/Icons/SelectIcon';
import UnselectIcon from '@/Icons/UnselectIcon';
import { storeIconCategory, storeIconType } from '@/logic/storage';
import { compareNames } from '@/logic/util';
import { IAppSettingsPageProps } from '../AppSettings';
import { useAppSettingsStyles } from '../appSettingsStyle';

export default function IconSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;
    const { classes } = useAppSettingsStyles();

    function updateIconCategorySettings(name: string, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconCategory(name, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[name].value = value;
            });
        }
        return iconSettings;
    }

    function updateIconSettings(category: string, type: string, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconType(category, type, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[category].types[type].value = value;
            });
        }
        return iconSettings;
    }

    function selectAllIconsByCategory(category: string, value: boolean) {
        const iconSettings = settings.iconSettings;
        if (iconSettings) {
            return produce(iconSettings, draft => {
                storeIconCategory(category, value);
                draft.categories[category].value = value;
                for (const type in draft.categories[category].types) {
                    draft.categories[category].types[type].value = value;
                    storeIconType(category, type, value);
                }
            });
        }
        return iconSettings;
    }
    if (!settings.iconSettings) {
        return null;
    }

    const elements = Object.entries(settings.iconSettings.categories).sort(compareNames).map(([categoryKey, category]) => {
        const typeChildren = Object.entries(category.types).sort(compareNames).map(([typeKey, type]) => {
            return <p key={'FrameMenuType' + typeKey}>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={type.value}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, e.currentTarget.checked) })}
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
                        onChange={e => updateSettings({ iconSettings: updateIconCategorySettings(categoryKey, e.currentTarget.checked) })}
                    />
                    {category.name}
                </label>
                <span />
                <button className={classes.selectIcon} onClick={() => updateSettings({ iconSettings: selectAllIconsByCategory(categoryKey, true) })}>
                    <SelectIcon />
                </button>
                <button className={classes.selectIcon} onClick={() => updateSettings({ iconSettings: selectAllIconsByCategory(categoryKey, false) })}>
                    <UnselectIcon />
                </button>
            </summary>
            <div className={classes.iconTypeContainer}>
                {typeChildren}
            </div>
        </details>;
    });

    return <>{elements}</>;
}
