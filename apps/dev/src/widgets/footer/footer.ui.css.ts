import { style } from "@vanilla-extract/css";

export const footerRoot = style({
  display: "flex",
  width: "100%",
  height: "var(--footer-height)",
  alignItems: "center",
  gap: 2,
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  fontSize: "14px",
  color: "var(--grey300)",
  lineHeight: 1.5,
});

export const footerLink = style({
  color: "var(--grey300)",
});
