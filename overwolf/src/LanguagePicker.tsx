import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, defaultLanguage, SupportedLocale, supportedLocales } from './i18n';
import GlobeIcon from './Icons/GlobeIcon';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',
        position: 'relative',
    },
    globe: {
        width: '1em',
        height: '1em',
        position: 'absolute',
        top: '0.1em',
        left: 0,
    },
    select: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        appearance: 'none',
        border: 'none',
        background: 'none',
        color: 'currentcolor',

        fontFamily: theme.bodyFontFamily,
        fontSize: typeof theme.bodyFontSize === 'number'
            ? theme.bodyFontSize - 2
            : `calc(${theme.bodyFontSize} - 2px)`,
        padding: '2px 4px 2px 1.5em',

        '& option': {
            color: 'initial',
        },
    },
}));

export default function LanguagePicker(props: IProps) {
    const { className } = props;
    const { classes } = useStyles();
    const { i18n } = useTranslation();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const next = e.currentTarget.value;
        if (supportedLocales.includes(next as SupportedLocale)) {
            changeLanguage(next as SupportedLocale);
        }
    }

    const locales = supportedLocales.map<[SupportedLocale, string]>(locale => [locale, i18n.getFixedT(locale)('lng')]);
    locales.sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }));

    let selectedLocale: string;
    if (supportedLocales.includes(i18n.language as SupportedLocale)) {
        selectedLocale = i18n.language;
    } else {
        const languageWithoutRegion = i18n.language.substr(0, 2);
        if (supportedLocales.includes(languageWithoutRegion as SupportedLocale)) {
            selectedLocale = languageWithoutRegion;
        } else {
            selectedLocale = defaultLanguage;
        }
    }

    return (
        <div className={clsx(classes.root, className)}>
            <GlobeIcon className={classes.globe} />
            <select
                className={classes.select}
                value={selectedLocale}
                onChange={handleChange}
            >
                {locales.map(l =>
                    <option key={l[0]} value={l[0]}>{l[1]}</option>
                )}
            </select>
        </div>
    );
}
