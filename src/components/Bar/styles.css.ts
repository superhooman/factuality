import { style } from "@vanilla-extract/css";

export const root = style({
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
});

export const bar = style({
    borderRadius: 'var(--radius-2)',
    backgroundColor: 'var(--accent-9)',
    height: '100%', 
})

export const wrapper = style({
    position: 'relative',
    width: '100%',
    height: 'var(--space-5)',
    backgroundColor: 'var(--gray-a3)',
    borderRadius: 'var(--radius-2)',
    overflow: 'hidden',
});

export const value = style({
    position: 'absolute',
    left: 'var(--space-1)',
    top: '50%',
    transform: 'translateY(-50%)',

    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--gray-surface)',
    padding: '0 var(--space-1)',
    borderRadius: 'var(--radius-2)',
    boxShadow: '0 0 0 1px var(--gray-a6)'
});
