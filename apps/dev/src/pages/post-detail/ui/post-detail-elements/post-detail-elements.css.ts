import { style } from "@vanilla-extract/css";

export const heading = style({
  marginTop: "2rem",
  marginBottom: "0.75rem",
  fontWeight: 600,

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
  marginTop: "1em",
  marginBottom: "1em",

  selectors: {
    "li  &": {
      marginTop: "0",
      marginBottom: "0",
    },
  },
});

export const li = style({
  marginTop: "0.5em",
  marginBottom: "0.75em",
  paddingLeft: "0.25em",
  fontWeight: "var(--font-weight-light)",
});

export const p = style({
  marginTop: "1.25em",
  marginBottom: "1.25em",
  fontWeight: "var(--font-weight-light)",

  selectors: {
    "li  &": {
      marginTop: "0.5em",
      marginBottom: "0.75em",
    },
  },
});

export const img = style({
  margin: "3rem auto",
  maxWidth: "100%",
  height: "auto",
});

export const link = style({
  fontWeight: "var(--font-weight-regular)",
  color: "var(--primary)",

  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export const pre = style({});

export const code = style({
  padding: "0.2em 0.4em",
  backgroundColor: "rgba(var(--grey100-rgb), 0.4)",
  borderRadius: "3px",
  fontSize: "85%",
});
