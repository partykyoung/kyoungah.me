import { style } from "@vanilla-extract/css";

export const div = style({
  selectors: {
    "&.expressive-code": {
      marginTop: "16px",
      marginBottom: "24px",
    },
  },
});
