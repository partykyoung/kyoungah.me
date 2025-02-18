import { style } from "@vanilla-extract/css";

export const root = style({
  width: "100%",
  padding: "0 16px",
  margin: "0 auto",

  "@media": {
    "screen and (min-width: 992px)": {
      width: "768px",
      padding: "0",
    },
  },
});
