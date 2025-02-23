import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  fontFamily: `var(--font-roboto), var(--font-noto-sans-kr), var(--font-fira-code), var(--default-font-family)`,
});

globalStyle("code, pre", {
  fontFamily: "Fira Code",
});

globalStyle(":root", {
  vars: {
    "--header-height": "56px",
    "--footer-height": "106px",
    "--white": "rgba(var(--white-rgb), 1)",
    "--grey100": "rgba(var(--grey100-rgb), 1)",
    "--grey200": "rgba(var(--grey200-rgb), 1)",
    "--grey300": "rgba(var(--grey300-rgb), 1)",
    "--grey400": "rgba(var(--grey400-rgb), 1)",
    "--grey500": "rgba(var(--grey500-rgb), 1)",
    "--grey600": "rgba(var(--grey600-rgb), 1)",
    "--grey700": "rgba(var(--grey700-rgb), 1)",
    "--grey800": "rgba(var(--grey800-rgb), 1)",
    "--grey900": "rgba(var(--grey900-rgb), 1)",

    "--blue100": "rgba(var(--blue100-rgb), 1)",
    "--blue200": "rgba(var(--blue200-rgb), 1)",
    "--blue300": "rgba(var(--blue300-rgb), 1)",
    "--blue400": "rgba(var(--blue400-rgb), 1)",
    "--blue500": "rgba(var(--blue500-rgb), 1)",
    "--blue600": "rgba(var(--blue600-rgb), 1)",
    "--blue700": "rgba(var(--blue700-rgb), 1)",
    "--blue800": "rgba(var(--blue800-rgb), 1)",
    "--blue900": "rgba(var(--blue900-rgb), 1)",

    "--green100": "rgba(var(--green100-rgb), 1)",
    "--green200": "rgba(var(--green200-rgb), 1)",
    "--green300": "rgba(var(--green300-rgb), 1)",
    "--green400": "rgba(var(--green400-rgb), 1)",
    "--green500": "rgba(var(--green500-rgb), 1)",
    "--green600": "rgba(var(--green600-rgb), 1)",
    "--green700": "rgba(var(--green700-rgb), 1)",
    "--green800": "rgba(var(--green800-rgb), 1)",
    "--green900": "rgba(var(--green900-rgb), 1)",

    "--yellow100": "rgba(var(--yellow100-rgb), 1)",
    "--yellow200": "rgba(var(--yellow200-rgb), 1)",
    "--yellow300": "rgba(var(--yellow300-rgb), 1)",
    "--yellow400": "rgba(var(--yellow400-rgb), 1)",
    "--yellow500": "rgba(var(--yellow500-rgb), 1)",
    "--yellow600": "rgba(var(--yellow600-rgb), 1)",
    "--yellow700": "rgba(var(--yellow700-rgb), 1)",
    "--yellow800": "rgba(var(--yellow800-rgb), 1)",
    "--yellow900": "rgba(var(--yellow900-rgb), 1)",

    "--red100": "rgba(var(--red100-rgb), 1)",
    "--red200": "rgba(var(--red200-rgb), 1)",
    "--red300": "rgba(var(--red300-rgb), 1)",
    "--red400": "rgba(var(--red400-rgb), 1)",
    "--red500": "rgba(var(--red500-rgb), 1)",
    "--red600": "rgba(var(--red600-rgb), 1)",
    "--red700": "rgba(var(--red700-rgb), 1)",
    "--red800": "rgba(var(--red800-rgb), 1)",
    "--red900": "rgba(var(--red900-rgb), 1)",

    /* ===== Semantic Colors ===== */
    "--info": "rgba(var(--info-rgb), 1)",
    "--primary": "rgba(var(--primary-rgb), 1)",
    "--success": "rgba(var(--success-rgb), 1)",
    "--warning": "rgba(var(--warning-rgb), 1)",
    "--danger": "rgba(var(--danger-rgb), 1)",
  },
});

globalStyle(".h1", {
  fontSize: "var(--font-size-h1)",
  lineHeight: "var(--line-height-h1)",
  letterSpacing: "var(--letter-spacing-h1)",
});

globalStyle(".h2", {
  fontSize: "var(--font-size-h2)",
  lineHeight: "var(--line-height-h2)",
  letterSpacing: "var(--letter-spacing-h2)",
});

globalStyle(".h3", {
  fontSize: "var(--font-size-h3)",
  lineHeight: "var(--line-height-h3)",
  letterSpacing: "var(--letter-spacing-h3)",
});

globalStyle(".h4", {
  fontSize: "var(--font-size-h4)",
  lineHeight: "var(--line-height-h4)",
  letterSpacing: "var(--letter-spacing-h4)",
});

globalStyle(".h5", {
  fontSize: "var(--font-size-h5)",
  lineHeight: "var(--line-height-h5)",
  letterSpacing: "var(--letter-spacing-h5)",
});

globalStyle(".h6", {
  fontSize: "var(--font-size-h6)",
  lineHeight: "var(--line-height-h6)",
  letterSpacing: "var(--letter-spacing-h6)",
});

globalStyle(".body-lg", {
  fontSize: "var(--font-size-body-lg)",
  lineHeight: "var(--line-height-body-lg)",
  letterSpacing: "var(--letter-spacing-body-lg)",
});

globalStyle(".body", {
  fontSize: "var(--font-size-body)",
  lineHeight: "var(--line-height-body)",
  letterSpacing: "var(--letter-spacing-body)",
});

globalStyle(".body-sm", {
  fontSize: "var(--font-size-body-sm)",
  lineHeight: "var(--line-height-body-sm)",
  letterSpacing: "var(--letter-spacing-body-sm)",
});

globalStyle(".caption", {
  fontSize: "var(--font-size-caption)",
  lineHeight: "var(--line-height-caption)",
  letterSpacing: "var(--letter-spacing-caption)",
});
