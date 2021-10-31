import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAppContext } from '@/contexts/AppContext';
import { getIconName } from '@/logic/icons';
import { compareNames } from '@/logic/util';
import { makeStyles } from '@/theme';
import { faComment, faCommentSlash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

interface IProps {
    category: IconCategorySetting | undefined;
    categoryKey: string;
    updateSettings: IAppContext['update'];
    updateIconCategorySettings: (categoryName: string, property: IconProperty, value: boolean) => IconSettings | undefined;
    updateIconSettings: (categoryName: string, typeName: string, property: IconProperty, value: boolean) => IconSettings | undefined;
    updateIconsInCategory: (categoryName: string, property: IconProperty, value: boolean) => IconSettings | undefined;
}

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

export default function IconSettingsCategory(props: IProps) {
    const {
        category,
        categoryKey,
        updateIconCategorySettings,
        updateIconSettings,
        updateIconsInCategory,
        updateSettings,
    } = props;
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();
    const { t } = useTranslation();

    if (!category) { return null; }

    const typeChildren = Object.entries(category.types).sort(compareNames).map(([typeKey, type]) => {
        if (!type) { return null; }
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

            <span className={classes.categoryTypeName}>{getIconName(type.category, type.type)}</span>
        </div>;
    });

    const hasAnyVisible = Object.values(category.types).some(t => t?.visible ?? false);
    const hasAnyShowLabel = Object.values(category.types).some(t => t?.showLabel ?? false);

    return <details key={categoryKey}>
        <summary className={sharedClasses.summary}>
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

            <span>{getIconName(category.category)}</span>
        </summary>

        <div className={classes.toggleAllEntry}>
            <label className={classes.checkboxIcon} title={t('settings.icon.toggleVisible')}>
                <input
                    type='checkbox'
                    checked={hasAnyVisible}
                    onChange={e => updateSettings({ iconSettings: updateIconsInCategory(categoryKey, 'visible', e.currentTarget.checked) })}
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
                    onChange={e => updateSettings({ iconSettings: updateIconsInCategory(categoryKey, 'showLabel', e.currentTarget.checked) })}
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

}
