import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import ReturnIcon from './Icons/ReturnIcon';
import { makeStyles } from './theme';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'grid',
        padding: theme.spacing(2),
        gap: theme.spacing(2),
        gridTemplateRows: '40px 1fr auto',
        gridTemplateColumns: '40px 1fr',
        gridTemplateAreas: '"return title" ". content" ". footer"',

        background: theme.frameMenuBackground,
        color: theme.frameMenuColor,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.frameMenu,
        backdropFilter: 'blur(10px)',
    },
    hidden: {
        display: 'none !important',
    },
    return: {
        background: 'transparent',
        border: 'none',
        color: theme.frameMenuColor,
        padding: 0,

        '&:focus': {
            outline: `1px solid ${theme.frameMenuColor}`,
        },
    },
    title: {
        gridArea: 'title',
        alignSelf: 'center',
        fontSize: 18,
    },
    content: {
        gridArea: 'content',
    },
    footer: {
        gridArea: 'footer',
    },
    checkbox: {
        '& > input[type="checkbox"]': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
}));

export default function FrameMenu(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    return <div className={clsx(classes.root, !visible && classes.hidden)}>
        <button className={classes.return} onClick={onClose}>
            <ReturnIcon />
        </button>
        <h2 className={classes.title}>Options</h2>
        <span className={classes.footer}>Open this menu at any time by right-clicking in the application.</span>
        <div className={classes.content}>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.transparentHeader}
                        onChange={e => context.update({ transparentHeader: e.currentTarget.checked })}
                    />
                    Transparent header
                </label>
            </p>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.transparentToolbar}
                        onChange={e => context.update({ transparentToolbar: e.currentTarget.checked })}
                    />
                    Transparent toolbar
                </label>
            </p>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.showHeader}
                        onChange={e => context.update({ showHeader: e.currentTarget.checked })}
                    />
                    Show header
                </label>
            </p>
            <p>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={context.value.showToolbar}
                        onChange={e => context.update({ showToolbar: e.currentTarget.checked })}
                    />
                    Show toolbar
                </label>
            </p>
        </div>
    </div>;
}
