import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  fontFamily: `"Roboto", "Noto Sans KR", var(--default-font-family)`,
});

globalStyle("code, pre", {
  fontFamily: "Fira Code",
});

globalStyle(":root", {
  vars: {
    "--header-height": "56px",
    "--footer-height": "106px",
  },
});

globalStyle(".container", {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  paddingLeft: "16px",
  paddingRight: "16px",
});
