import { style } from "@vanilla-extract/css";

export const heading = style({
  marginTop: "2rem",
  marginBottom: "0.75rem",

  selectors: {
    ":is(h1, h2, h3, h4, h5, h6) + &": {
      marginTop: "1rem",
    },
  },

  "@media": {
    "screen and (min-width: 992px)": {
      marginTop: "2.5rem",
      marginBottom: "1rem",

      selectors: {
        ":is(h1, h2, h3, h4, h5, h6) + &": {
          marginTop: "1.5rem",
        },
      },
    },
  },
});

export const list = style({
  paddingLeft: "1.625em",
});

export const li = style({
  marginBottom: "1em", // Adjusted for spacing
  paddingLeft: "0.25em", // Adjusted for alignment
  fontWeight: "var(--font-weight-light)",

  selectors: {
    "li > ul > &": {
      marginTop: "0.75em", // Adjusted for nested lists
    },
  },
});

export const p = style({
  fontWeight: "var(--font-weight-light)",
});

export const img = style({});

export const link = style({});

export const pre = style({});
