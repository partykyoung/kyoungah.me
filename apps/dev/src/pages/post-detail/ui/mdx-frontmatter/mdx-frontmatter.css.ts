import { style } from "@vanilla-extract/css";

export const root = style({
  paddingTop: "3rem",
  paddingBottom: "2rem",

  "@media": {
    "screen and (min-width: 992px)": {
      paddingTop: "6rem",
      paddingBottom: "5rem",
    },
  },
});

export const title = style({
  marginBottom: "1.5rem",
});

export const date = style({
  fontWeight: "var(--font-weight-light)",
});

export const tags = style({
  marginTop: "1rem",
  listStyle: "none",
});

export const tag = style({
  fontWeight: "var(--font-weight-light)",
});
