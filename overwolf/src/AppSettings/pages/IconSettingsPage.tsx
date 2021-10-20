import clsx from 'clsx';
import produce from 'immer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { storeIconConfiguration } from '@/logic/storage';
import { compareNames } from '@/logic/util';
import { makeStyles } from '@/theme';
import { faComment, faCommentSlash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAppSettingsPageProps } from '../AppSettings';

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

        '&:hover, &:focus': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.2)',
        },
    },
    checkboxIcon: {
        padding: '2px 4px',
        borderRadius: theme.borderRadiusMedium,
        display: 'inline-block',
        marginRight: 2,

        '&:hover': {
            background: theme.buttonBackgroundHover,
        },

        '&:focus-within': {
            background: theme.buttonBackgroundHover,
        },

        '& > input[type="checkbox"]': {
            width: 0,
            height: 0,
            margin: 0,
        },
    },
    invisible: {
        visibility: 'hidden',
    },
    categoryTypeName: {
        marginLeft: 8,
    },
    toggleAllEntry: {
        margin: theme.spacing(1, 0, 1, 3),
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
    const { t } = useTranslation();
    const { classes } = useStyles();

    function updateIconCategorySettings(name: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(name, undefined, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[name][property] = value;
            });
        }
        return iconSettings;
    }

    function updateIconSettings(category: string, type: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(category, type, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                draft.categories[category].types[type][property] = value;
            });
        }
        return iconSettings;
    }

    function selectAllIconsByCategory(category: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        if (iconSettings) {
            return produce(iconSettings, draft => {
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
            return <div key={typeKey}>
                <label className={classes.checkboxIcon} title={t('settings.icon.toggleVisible')}>
                    <input
                        type='checkbox'
                        checked={type.visible}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'visible', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={type.visible ? faEye : faEyeSlash}
                        opacity={type.visible ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <label className={clsx(classes.checkboxIcon, !type.visible && classes.invisible)} title={t('settings.icon.toggleShowLabel')}>
                    <input
                        type='checkbox'
                        checked={type.showLabel}
                        onChange={e => updateSettings({ iconSettings: updateIconSettings(categoryKey, typeKey, 'showLabel', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={type.showLabel ? faComment : faCommentSlash}
                        opacity={type.showLabel ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <span className={classes.categoryTypeName}>{type.name}</span>
            </div>;
        });

        const hasAnyVisible = Object.values(category.types).some(t => t.visible);
        const hasAnyShowLabel = Object.values(category.types).some(t => t.showLabel);

        return <details key={categoryKey}>
            <summary className={classes.iconCategory}>
                <label className={classes.checkboxIcon} title={t('settings.icon.toggleVisible')}>
                    <input
                        type='checkbox'
                        checked={category.visible}
                        onChange={e => updateSettings({ iconSettings: updateIconCategorySettings(categoryKey, 'visible', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={category.visible ? faEye : faEyeSlash}
                        opacity={category.visible ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <label className={clsx(classes.checkboxIcon, !category.visible && classes.invisible)} title={t('settings.icon.toggleShowLabel')}>
                    <input
                        type='checkbox'
                        checked={category.showLabel}
                        onChange={e => updateSettings({ iconSettings: updateIconCategorySettings(categoryKey, 'showLabel', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={category.showLabel ? faComment : faCommentSlash}
                        opacity={category.showLabel ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <span>{category.name}</span>
            </summary>

            <div className={classes.toggleAllEntry}>
                <label className={classes.checkboxIcon} title={t('settings.icon.toggleVisible')}>
                    <input
                        type='checkbox'
                        checked={hasAnyVisible}
                        onChange={e => updateSettings({ iconSettings: selectAllIconsByCategory(categoryKey, 'visible', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={hasAnyVisible ? faEye : faEyeSlash}
                        opacity={hasAnyVisible ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <label className={classes.checkboxIcon} title={t('settings.icon.toggleShowLabel')}>
                    <input
                        type='checkbox'
                        checked={hasAnyShowLabel}
                        onChange={e => updateSettings({ iconSettings: selectAllIconsByCategory(categoryKey, 'showLabel', e.currentTarget.checked) })}
                    />
                    <FontAwesomeIcon
                        icon={hasAnyShowLabel ? faComment : faCommentSlash}
                        opacity={hasAnyShowLabel ? 1 : 0.5}
                        fixedWidth={true}
                    />
                </label>

                <span className={classes.categoryTypeName}>{t('settings.icon.toggleAll')}</span>
            </div>

            <div className={classes.iconTypeContainer}>
                {typeChildren}
            </div>
        </details>;
    });

    return <>{elements}</>;
}
