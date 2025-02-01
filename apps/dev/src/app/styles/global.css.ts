import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  fontFamily: `"Roboto", "Noto Sans KR", var(--default-font-family)`,
});

globalStyle("code, pre", {
  fontFamily: "Fira Code",
});
