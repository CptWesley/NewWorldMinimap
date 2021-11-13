import React, { useState } from 'react';
import { FeatureCollection } from 'geojson';
import { IAppSettingsPageProps } from '@/AppSettings/AppSettings';
import { useTranslation } from 'react-i18next';
import { AppContextSettings } from '@/contexts/AppContext';
import {makeStyles} from '@/theme';
import clsx from 'clsx';

const useStyles = makeStyles()(() => ({
    dataText: {
        whiteSpace: 'pre-line',
        wordBreak: 'break-word',
        margin: '5px 0',
        height: '70%',
        width: '80%',
    },
}));

export const featureCollectionPageEnabled = (appSettings: AppContextSettings) =>  {
    return appSettings.enabledPreviewFunctionailities.includes('feature-collection-render');
};

export default function FeatureCollectionPage (props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;

    const { classes } = useStyles();
    const { t } = useTranslation();

    const [rawFeatureCollection, setRawFeatureCollection] = useState<string>(
        JSON.stringify(settings.featureCollection, null, 2)
    );
    const [parseError, setParseError] = useState(false);

    const onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const newRawFeatureCollection = event.currentTarget.value;
        setRawFeatureCollection(newRawFeatureCollection);
        try {
            // TODO: Guard against invalid output with proper geojson parser.
            updateSettings(
                {
                    featureCollection: JSON.parse(newRawFeatureCollection) as FeatureCollection,
                }
            );
            setParseError(false);
        } catch (error) {
            setParseError(true);
        }
    };

    return (
        <>
            <textarea className={clsx(classes.dataText)} value={rawFeatureCollection} onChange={onChange} />
            {parseError && <div>{t('settings.featureCollection.inavlidGeoJSON')}</div>}
        </>
    );

}
