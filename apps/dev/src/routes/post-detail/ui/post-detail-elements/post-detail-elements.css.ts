import { style } from "@vanilla-extract/css";

export const heading = style({
  marginTop: "2rem",
  marginBottom: "1rem",
  fontWeight: "var(--font-weight-bold)",

  selectors: {
    ":is(h1, h2, h3, h4, h5, h6) + &": {
      marginTop: "1rem",
    },
  },

  "@media": {
    "screen and (min-width: 992px)": {
      marginTop: "2rem",
      marginBottom: "1rem",

      selectors: {
        ":is(h1, h2, h3, h4, h5, h6) + &": {
          marginTop: "1rem",
        },
      },
    },
  },
});

export const list = style({
  paddingLeft: "1.625em",
  marginTop: "1rem",
  marginBottom: "1rem",

  selectors: {
    "li  &": {
      marginTop: "0",
      marginBottom: "0",
    },
  },
});

export const li = style({
  marginTop: "0.5em",
  marginBottom: "0.5em",
  paddingLeft: "0.25em",
  letterSpacing: "-0.004rem",
  fontWeight: "var(--font-weight-regular)",
  lineHeight: "var(--line-height-body)",
});

export const p = style({
  marginTop: "1em",
  marginBottom: "1em",
  letterSpacing: "-0.004rem",
  fontWeight: "var(--font-weight-regular)",
  lineHeight: "var(--line-height-body)",

  selectors: {
    "li  &": {
      marginTop: "0.25em",
      marginBottom: "0.5em",
    },
  },
});

export const img = style({
  margin: "2rem auto",
  maxWidth: "100%",
  height: "auto",
  display: "block",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
});

export const link = style({
  fontWeight: "var(--font-weight-medium)",
  color: "var(--primary)",

  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export const caption = style({
  fontSize: "var(--font-size-small)",
  lineHeight: "var(--line-height-small)",
  textAlign: "center",
  color: "var(--grey500)",
  margin: "0.5rem auto 1.5rem",
  fontWeight: "var(--font-weight-regular)",
});
