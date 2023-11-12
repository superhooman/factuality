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
