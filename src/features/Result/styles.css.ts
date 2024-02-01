import { style } from "@vanilla-extract/css";

export const description = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

export const favicon = style({
    boxShadow: "0 0 0 1px var(--gray-a4)",
    borderRadius: "var(--radius-4)",
    backgroundColor: 'white',
});

export const avatar = style({
    height: 16,
    width: 16,
    fill: 'currentColor',
});

export const callout = style({
    backgroundColor: 'var(--green-a3)',
    color: 'var(--green-a12)',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-4)',
});

export const tabsRoot = style({
    width: '100%',
});
