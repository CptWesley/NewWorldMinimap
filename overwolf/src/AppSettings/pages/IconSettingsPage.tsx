import produce from 'immer';
import React from 'react';
import SelectIcon from '@/Icons/SelectIcon';
import UnselectIcon from '@/Icons/UnselectIcon';
import { storeIconCategory, storeIconType } from '@/logic/storage';
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

    function updateIconSettings(category: string, type: string, key: string, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconType(category, type, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[category].types[type][key] = value;
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
                <label className={classes.checkboxIcon}>
                    <input
                        type='checkbox'
                        checked={type.value}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'value', e.currentTarget.checked) })}
                    />
                    {type.value ? <FontAwesomeIcon icon={faEye} className='showIcon' /> : <FontAwesomeIcon icon={faEyeSlash} className='showIcon' />}
                </label>

                <label className={classes.checkboxIcon}>
                    <input
                        type='checkbox'
                        checked={type.value}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'label', e.currentTarget.checked) })}
                    />
                    {type.label ? <FontAwesomeIcon icon={faComment} className='showIcon' /> : <FontAwesomeIcon icon={faCommentSlash} className='showIcon' />}
                </label>
            </p>;
        });

        return <details key={'FrameMenuCat' + categoryKey}>
            <summary className={classes.iconCategory}>
                <label className={sharedClasses.checkbox}>
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
