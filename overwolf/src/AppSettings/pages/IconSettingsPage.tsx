import produce from 'immer';
import React from 'react';
import { storeIconConfiguration } from '@/logic/storage';
import { compareNames } from '@/logic/util';
import { IAppSettingsPageProps } from '../AppSettings';
import IconSettingsCategory from './IconSettingsCategory';

export default function IconSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;

    function updateIconCategorySettings(categoryName: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(categoryName, undefined, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                const category = draft.categories[categoryName];
                if (category) {
                    category[property] = value;
                }
            });
        }
        return iconSettings;
    }

    function updateIconSettings(categoryName: string, typeName: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        storeIconConfiguration(categoryName, typeName, property, value);
        if (iconSettings) {
            return produce(iconSettings, draft => {
                const type = draft.categories[categoryName]?.types[typeName];
                if (type) {
                    type[property] = value;
                }
            });
        }
        return iconSettings;
    }

    function selectAllIconsByCategory(categoryName: string, property: IconProperty, value: boolean) {
        const iconSettings = settings.iconSettings;
        if (iconSettings) {
            return produce(iconSettings, draft => {
                const category = draft.categories[categoryName];
                if (category) {
                    for (const [typeName, type] of Object.entries(category.types)) {
                        if (type) {
                            type[property] = value;
                        }
                        storeIconConfiguration(categoryName, typeName, property, value);
                    }
                }
            });
        }
        return iconSettings;
    }
    if (!settings.iconSettings) {
        return null;
    }

    const elements = Object
        .entries(settings.iconSettings.categories)
        .sort(compareNames)
        .map(([categoryKey, category]) =>
            <IconSettingsCategory
                key={categoryKey}
                categoryKey={categoryKey}
                category={category}
                selectAllIconsByCategory={selectAllIconsByCategory}
                updateIconCategorySettings={updateIconCategorySettings}
                updateIconSettings={updateIconSettings}
                updateSettings={updateSettings}
            />
        );

    return <>{elements}</>;
}
