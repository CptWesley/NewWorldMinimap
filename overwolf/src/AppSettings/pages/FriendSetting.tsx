import clsx from 'clsx';
import { isEqual } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/Button';
import { deleteFriend, putFriend, StoredFriend, updateFriend } from '@/logic/friends';
import { generateRandomToken } from '@/logic/util';
import { makeStyles } from '@/theme';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

interface IProps {
    friend: StoredFriend;
    onChange: () => void;
    onCanceled?: () => void;
    isNew?: boolean;
}

const useStyles = makeStyles()(theme => ({
    root: {
        marginTop: theme.spacing(1),
        border: `1px solid ${theme.detailsBoxBorderColor}`,
        borderRadius: theme.borderRadiusSmall,
    },
    summary: {
        marginBottom: 0,
    },
    content: {
        padding: theme.spacing(1),
    },
    wide: {
        width: 600,
        maxWidth: '100%',
    },
    buttons: {
        display: 'flex',
        gap: theme.spacing(1),
    },
}));

export default function FriendSetting(props: IProps) {
    const {
        friend,
        onChange,
        onCanceled,
        isNew,
    } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();

    const [open, setOpen] = useState(false);
    const [changes, setChanges] = useState<Partial<StoredFriend>>({});

    useEffect(() => {
        if (!open) {
            setChanges({});
        }
    }, [open]);

    const displayFriend = { ...friend, ...changes };

    const shortId = displayFriend.id.substr(0, 10);
    const title = displayFriend.name || shortId || t('settings.friend.new');
    const inputToken = useMemo(generateRandomToken, [displayFriend.id]);
    const canSave = displayFriend.id.length > 0 && !isEqual(friend, displayFriend);

    function registerChange<TKey extends keyof StoredFriend>(key: TKey, value: StoredFriend[TKey]) {
        setChanges(c => ({ ...c, [key]: value }));
    }

    function toggleOpen(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        if (open && onCanceled) {
            onCanceled();
        }
        setOpen(isNew || !open);
    }

    function handleCancel() {
        onCanceled?.();
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isNew) {
            await putFriend(displayFriend);
        } else {
            await updateFriend(friend.id, changes);
        }
        setOpen(false);
        onChange();
    }

    async function handleDelete() {
        await deleteFriend(friend);
        setOpen(false);
        onChange();
    }

    return <details className={classes.root} open={isNew || open} onSubmit={handleSave}>
        <summary
            className={clsx(sharedClasses.summary, classes.summary)}
            onClick={toggleOpen}
        >
            {title}
        </summary>
        <form className={classes.content}>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-id-${inputToken}`}>{t('settings.friend.friendId')}</label>
                </p>
                <input
                    id={`friend-setting-id-${inputToken}`}
                    type='text'
                    className={clsx(sharedClasses.textbox, classes.wide)}
                    onChange={e => registerChange('id', e.currentTarget.value)}
                    value={displayFriend.id}
                />
            </div>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-name-${inputToken}`}>{t('settings.friend.friendName')}</label>
                </p>
                <input
                    id={`friend-setting-name-${inputToken}`}
                    type='text'
                    className={sharedClasses.textbox}
                    onChange={e => registerChange('name', e.currentTarget.value)}
                    value={displayFriend.name}
                />
            </div>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-psk-${inputToken}`}>{t('settings.friend.friendPsk')}</label>
                </p>
                <input
                    id={`friend-setting-psk-${inputToken}`}
                    type='text'
                    className={sharedClasses.textbox}
                    onChange={e => registerChange('psk', e.currentTarget.value)}
                    value={displayFriend.psk}
                />
            </div>

            <div className={classes.buttons}>
                <Button type='submit' disabled={!canSave}>{t('save')}</Button>
                {isNew
                    ? <Button onClick={handleCancel}>{t('cancel')}</Button>
                    : <Button onClick={handleDelete}>{t('delete')}</Button>
                }
            </div>
        </form>
    </details>;
}
