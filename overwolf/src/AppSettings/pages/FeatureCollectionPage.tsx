import React, { useState } from 'react';
import { FeatureCollection } from 'geojson';
import { IAppSettingsPageProps } from '@/AppSettings/AppSettings';

export default function FeatureCollectionPage (props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;

    const [rawFeatureCollection, setRawFeatureCollection] = useState<string>(
        JSON.stringify(settings.featureCollection, null, 2)
    );
    const [parseError, setParseError] = useState(false);

    const onChange = (event) => {
        const newRawFeatureCollection = event.target.value;
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
            {/* TODO: Style this better. */}
            <textarea value={rawFeatureCollection} onChange={onChange} />
            {parseError && <div>Uh.. provide a valid featureCollection GeoJSON please.</div>}
        </>
    );

}
