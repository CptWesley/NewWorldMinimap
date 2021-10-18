import produce from 'immer';
import React from 'react';
import SelectIcon from '@/Icons/SelectIcon';
import UnselectIcon from '@/Icons/UnselectIcon';
import { storeIconConfiguration } from '@/logic/storage';
import { compareNames } from '@/logic/util';
import { makeStyles } from '@/theme';
import { faComment, faCommentSlash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

const useStyles = makeStyles()(theme => ({
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
    iconCategory: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 3,
        padding: 2,

        '& > span': {
            flexGrow: 1,
        },

        '&:focus': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.15)',
        },

        '&:hover': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.33)',
        },
    },
    checkboxIcon: {
        '& > input[type="checkbox"]': {
            display: 'none',
        },
        '& > .showIcon': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
    iconTypeContainer: {
        margin: theme.spacing(0, 0, 1, 3),
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
}));

export default function IconSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();
    const actionIcon = {
        'visible': {
            'true': faEye,
            'false': faEyeSlash,
        },
        'label': {
            'true': faComment,
            'false': faCommentSlash,
        },
    };

    function updateIconCategorySettings(name: string, property: 'visible' | 'label', value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(name, null, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[name][property] = value;
            });
        }
        return iconSettings;
    }

    function updateIconSettings(category: string, type: string, property: 'visible' | 'label', value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(category, type, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[category].types[type][property] = value;
            });
        }
        return iconSettings;
    }

    // Get icon opacity based on the item context
    function getIconOpacity(item: IconTypeSetting | IconCategorySetting, action: 'visible' | 'label') {
        // If item is not visible, the label icon should reduce their opacity
        if (action === 'label' && !item.visible) {
            return 0.5;
        }

        return 1;
    }

    function printInteractiveItem(item: IconTypeSetting | IconCategorySetting, action: 'visible' | 'label') {
        const opacity = getIconOpacity(item, action);
        const color = opacity < 1 ? 'white' : item[action] ? 'green' : 'red';
        return <FontAwesomeIcon color={color} icon={actionIcon[action][item[action].toString()]} opacity={opacity} fixedWidth={true} className='showIcon' />;
    }

    function selectAllIconsByCategory(category: string, value: boolean) {
        // TODO: Modify it when the general flow is approve and allow the category assign
        const property = 'visible';
        const iconSettings = settings.iconSettings;
        if (iconSettings) {
            return produce(iconSettings, draft => {
                storeIconConfiguration(category, null, 'visible', value);
                draft.categories[category][property] = value;
                for (const type in draft.categories[category].types) {
                    draft.categories[category].types[type][property] = value;
                    storeIconConfiguration(category, type, property, value);
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
                <label className={classes.checkboxIcon}>
                    <input
                        type='checkbox'
                        checked={type.visible}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'visible', e.currentTarget.checked) })}
                    />
                    {printInteractiveItem(type, 'visible')}
                </label>

                <label className={classes.checkboxIcon}>
                    <input
                        type='checkbox'
                        checked={type.label}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'label', e.currentTarget.checked) })}
                    />
                    {printInteractiveItem(type, 'label')}
                </label>

                <span>{type.name}</span>
            </p>;
        });

        return <details key={'FrameMenuCat' + categoryKey}>
            <summary className={classes.iconCategory}>
                <label className={sharedClasses.checkbox}>
                    <input
                        type='checkbox'
                        checked={category.visible}
                        onChange={e => updateSettings({ iconSettings: updateIconCategorySettings(categoryKey, 'visible', e.currentTarget.checked) })}
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
