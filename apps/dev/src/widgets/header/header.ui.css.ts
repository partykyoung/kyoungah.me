import { style } from "@vanilla-extract/css";

export const headerRoot = style({
  display: "flex",
  width: "100%",
  height: "var(--header-height)",
  padding: "0 16px",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0px 0px 8px var(--grey100)",

  "@media": {
    "screen and (min-width: 1920px)": {
      padding: "0",
    },
  },
});

export const headerContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "1440px",
  height: "100%",
  margin: "0 auto",
});

export const headerLogo = style({
  maxWidth: "156px",
  height: "auto",

  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: "196px",
    },
  },
});

export const headerNavList = style({
  display: "flex",
  alignItems: "center",
  columnGap: "8px",
  listStyle: "none",

  "@media": {
    "screen and (min-width: 320px)": {
      columnGap: "12px",
    },
    "screen and (min-width: 768px)": {
      columnGap: "24px",
    },
  },
});

export const headerNavItem = style({
  height: "36px",
  lineHeight: "36px",
});

export const headerNavItemLink = style([
  {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "100%",
    borderRadius: "9999px",
    backgroundColor: "rgba(var(--grey100-rgb), 0.3)",

    "@media": {
      "screen and (min-width: 768px)": {
        width: "auto",
        backgroundColor: "transparent",
      },
    },
  },
]);

export const headerNavItemLinkImage = style({
  width: "24px",
  height: "24px",
  filter:
    "invert(62%) sepia(19%) saturate(231%) hue-rotate(150deg) brightness(87%) contrast(84%)",

  "@media": {
    "screen and (min-width: 768px)": {
      display: "none",
    },
  },
});

export const headerNavItemLinkText = style([
  {
    position: "absolute",
    overflow: "hidden",
    width: "1px",
    height: "1px",
    margin: "-1px",
    clip: "rect(0, 0, 0, 0)",

    "@media": {
      "screen and (min-width: 768px)": {
        position: "static", // 위치 재설정
        overflow: "visible",
        width: "auto",
        height: "auto",
        margin: "0",
        clip: "unset",
        fontSize: "18px",
        color: "var(--grey400)",
        fontWeight: 400,
      },
    },
  },
]);
