import { style } from "@vanilla-extract/css";

export const item = style({
    padding: "var(--space-2)",
    borderRadius: "var(--radius-4)",

    ':hover': {
        backgroundColor: "var(--gray-a2)",
    }
});

export const favicon = style({
    boxShadow: "0 0 0 1px var(--gray-a4)",
    borderRadius: "var(--radius-3)",
    backgroundColor: 'white',
});

