import { style } from "@vanilla-extract/css";

export const root = style({
  width: "100%",
  padding: "76px 0",
});

export const postPreview = style({
  paddingBottom: "24px",
  borderBottom: "1px solid rgba(var(--grey100-rgb), 0.5)",
  listStyle: "none",

  selectors: {
    "&:not(:last-of-type)": {
      marginBottom: "24px",
    },
  },
});
