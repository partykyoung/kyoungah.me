import { style } from "@vanilla-extract/css";

export const h2 = style({
  marginBottom: "16px",
  marginTop: "28px",
  fontWeight: 700,
  selectors: {
    "h1 + &": {
      marginTop: "16px",
    },
    "h2 + &": {
      marginTop: "16px",
    },
  },
});

export const h3 = style({
  marginBottom: "16px",
  marginTop: "28px",
  fontWeight: 600,
  selectors: {
    "h1 + &": {
      marginTop: "16px",
    },
    "h2 + &": {
      marginTop: "16px",
    },
  },
});

export const h4 = style({
  fontSize: "26px",
  fontWeight: 600,
  lineHeight: "1.5",
  marginTop: "18px",
  marginBottom: "16px",
  "@media": {
    "(min-width: 768px)": {
      marginTop: "24px",
      marginBottom: "20px",
    },
    "(min-width: 1024px)": {
      marginTop: "34px",
      marginBottom: "24px",
    },
  },
});

export const h5 = style({
  fontSize: "22px",
  fontWeight: 600,
  lineHeight: "1.5",
  marginTop: "16px",
  marginBottom: "14px",
  "@media": {
    "(min-width: 768px)": {
      marginTop: "20px",
      marginBottom: "18px",
    },
    "(min-width: 1024px)": {
      marginTop: "32px",
      marginBottom: "20px",
    },
  },
});

export const h6 = style({
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "1.5",
  marginTop: "14px",
  marginBottom: "12px",
  "@media": {
    "(min-width: 768px)": {
      marginTop: "18px",
      marginBottom: "16px",
    },
    "(min-width: 1024px)": {
      marginTop: "28px",
      marginBottom: "18px",
    },
  },
});

export const p = style({
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "1.75",
  letterSpacing: "0.5px",
  marginTop: "0.5rem",
  marginBottom: "0.5rem",
});

export const ul = style({
  paddingLeft: "1.625em",
});

export const ol = style({
  paddingLeft: "1.625em",
});

export const li = style({
  marginTop: ".5em",
  marginBottom: ".5em",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "1.75",
  letterSpacing: "0.5px",
});

export const img = style({
  marginTop: "16px",
  marginBottom: "16px",
  "@media": {
    "(min-width: 768px)": {
      marginTop: "20px",
      marginBottom: "20px",
    },
    "(min-width: 1024px)": {
      marginTop: "28px",
      marginBottom: "28px",
    },
  },
});

export const link = style({
  color: "var(--primary-color)",
  textDecoration: "none",
  borderBottom: "1px solid transparent",
  transition: "border-bottom 0.3s ease",
  ":hover": {
    borderBottom: "1px solid var(--primary-color)",
  },
});

export const pre = style({
  marginTop: "16px",
  marginBottom: "16px",
  fontSize: "14px",
  lineHeight: "1.6",
  "@media": {
    "(min-width: 768px)": {
      marginTop: "20px",
      marginBottom: "20px",
    },
    "(min-width: 1024px)": {
      marginTop: "28px",
      marginBottom: "28px",
    },
  },
});
