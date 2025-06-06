import { style } from "@vanilla-extract/css";

export const div = style({
  selectors: {
    "&.expressive-code": {
      marginTop: "20px",
      marginBottom: "20px",
    },
  },
});
