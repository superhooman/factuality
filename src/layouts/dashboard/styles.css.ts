import { media } from "@src/styles/breakpoints";
import { style } from "@vanilla-extract/css";

export const root = style({
    position: 'relative'
});

export const close = style({
    '@media': {
        [media.up('sm')]: {
            display: 'none',
        }
    }
})

export const sidebar = style({
    width: 320,
    boxShadow: "1px 0 0 0 var(--gray-a4)",
    height: '100vh',
    top: 0,
    position: 'sticky',

    '@media': {
        [media.down('md')]: {
            width: 240,
        }
    }
});

export const wrapper = style({
    display: 'flex',
    padding: 'var(--space-4) var(--space-5)',
    maxWidth: 'calc(100% - 320px)',
    flexGrow: 1,

    '@media': {
        [media.down('md')]: {
            maxWidth: 'calc(100% - 240px)',
        },
        [media.down('sm')]: {
            maxWidth: '100%',
        }
    }
});

export const container = style({
    maxWidth: 1280,
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
});
