import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

const buttonVariants = recipe({
  base: {
    borderRadius: "4px",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "0.12s",
    transitionTimingFunction: "ease-out",
  },
  variants: {
    variant: {
      fill: {},
      outline: {},
      text: {},
    },
    color: {
      primary: {
        backgroundColor: "var(--primary)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
        [":hover"]: {
          backgroundColor: "var(--blue600)",
          borderColor: "var(--blue600)",
        },
      },
      info: {
        backgroundColor: "var(--info)",
        borderColor: "var(--info)",
        color: "var(--info)",
        [":hover"]: {
          backgroundColor: "var(--grey600)",
          borderColor: "var(--grey600)",
        },
      },
      success: {
        backgroundColor: "var(--success)",
        borderColor: "var(--success)",
        color: "var(--success)",
        [":hover"]: {
          backgroundColor: "var(--green600)",
          borderColor: "var(--green600)",
        },
      },
      warning: {
        backgroundColor: "var(--warning)",
        borderColor: "var(--warning)",
        color: "var(--warning)",
        [":hover"]: {
          backgroundColor: "var(--yellow600)",
          borderColor: "var(--yellow600)",
        },
      },
      danger: {
        backgroundColor: "var(--danger)",
        borderColor: "var(--danger)",
        color: "var(--danger)",
        [":hover"]: {
          backgroundColor: "var(--red600)",
          borderColor: "var(--red600)",
        },
      },
    },
    size: {
      small: {
        paddingTop: 4,
        paddingRight: 8,
        paddingBottom: 4,
        paddingLeft: 8,
        fontSize: 14,
      },
      medium: {
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 8,
        paddingLeft: 12,
        fontSize: 16,
      },
      large: {
        paddingTop: 12,
        paddingRight: 16,
        paddingBottom: 12,
        paddingLeft: 16,
        fontSize: 18,
      },
    },
  },

  compoundVariants: [
    {
      variants: {
        variant: "fill",
      },
      style: {
        color: "var(--white)",
        [":hover"]: {
          color: "var(--white)",
        },
      },
    },
    {
      variants: {
        variant: "outline",
      },
      style: {
        backgroundColor: "transparent",
        [":hover"]: {
          backgroundColor: "transparent",
        },
      },
    },
    {
      variants: {
        variant: "text",
      },
      style: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        [":hover"]: {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "fill",
    color: "primary",
    size: "small",
  },
});

type ButtonVariants = RecipeVariants<typeof buttonVariants>;

export { type ButtonVariants };
export { buttonVariants };
