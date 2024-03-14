import { media } from "@src/styles/breakpoints";
import { style } from "@vanilla-extract/css";

export const root = style({
    padding: 'var(--space-5) 0',
    width: '100%',

    selectors: {
        '[data-show-value="true"]&': {
            paddingTop: 'var(--space-6)',
        }
    }
});

export const scale = style({
    position: 'relative',
    height: 'var(--space-4)',
    borderRadius: 'var(--space-2)',
    
    selectors: {
        '[data-variant="rainbow"] &': {
            background: 'linear-gradient(to right, var(--red-9), var(--yellow-9), var(--green-9))',
        },
        '[data-variant="blue-red"] &': {
            background: 'linear-gradient(to right, var(--blue-9), var(--red-9))',
        },
        '[data-variant="mono"] &': {
            background: 'linear-gradient(to right, var(--gray-12), var(--gray-4))',
        },
    }
});

export const dot = style({
    position: 'absolute',
    width: 'var(--space-4)',
    height: 'var(--space-4)',
    borderRadius: '50%',
    background: 'var(--white)',
    border: '2px solid var(--color-page-background)',
    boxShadow: 'var(--shadow-6)',

    transition: 'left 0.2s',
});

export const value = style({
    position: 'absolute',
    top: 'calc(-1 * var(--space-6))',
    transform: 'translateX(-50%)',
    left: '50%',
});

export const label = style({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: 'calc(100% + var(--space-2))',
    transform: 'translateX(-50%)',
    gap: 'var(--space-1)',
    whiteSpace: 'nowrap',

    "::before": {
        content: '""',
        height: 'var(--space-3)',
        width: '1px',
        background: 'var(--gray-9)',
    },

    selectors: {
        '&[data-start="true"]': {
            transform: 'none',
            alignItems: 'flex-start',
        },
        '&[data-last="true"]': {
            left: 'unset',
            right: 0,
            alignItems: 'flex-end',
            textAlign: 'right',
        }
    },

    '@media': {
        [media.down('sm')]: {
            selectors: {
                '&:not([data-start="true"]):not([data-last="true"]):not([data-middle="true"])': {
                    display: 'none',
                },
            }
        }
    }
});