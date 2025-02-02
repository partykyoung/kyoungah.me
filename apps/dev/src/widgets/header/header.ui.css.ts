import { style } from "@vanilla-extract/css";

export const headerRoot = style({
  display: "flex",
  width: "100%",
  height: "var(--header-height)",
  padding: "0 12px",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0px 0px 8px var(--grey100)",
});

export const headerLogo = style({
  maxWidth: "205px",
  height: "auto",
});
// .header-root {
//   display: flex;
//   width: 100%;
//   height: var(--header-height);
//   padding: 0 12px;
//   align-items: center;
//   justify-content: space-between;
//   box-shadow: 0px 0px 8px hsla(var(--palette-gray-20), 100%);

//   a {
//     color: hsla(var(--palette-gray-60), 100%);
//   }
// }

// .header-logo {
//   max-width: 194px;
//   height: auto;
// }

// .header-navigation {
//   padding-left: 28px;
// }

// .header-navigation-list {
//   display: flex;
//   column-gap: 12px;
//   list-style: none;
// }

// .header-navigation-item {
//   height: 36px;
//   line-height: 36px;
// }

// .header-navigation-item-link {
//   display: inline-flex;
//   position: relative;
//   width: 36px;
//   height: 100%;
//   border-radius: 100%;
//   align-items: center;
//   justify-content: center;
//   background-color: hsla(var(--palette-gray-20), 100%);
//   border-radius: 9999px;

//   &:after {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     border-radius: 9999px;
//     background-color: hsla(var(--palette-gray-80), 100%);
//     mask-size: 24px;
//     mask-position: center;
//     mask-repeat: no-repeat;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     content: '';
//   }

//   &.tags {
//     &:after {
//       mask-image: url('/images/tag.svg');
//     }
//   }

//   &.about {
//     &:after {
//       mask-image: url('/images/person.svg');
//     }
//   }
// }

// @mixin min-width $xxSmallDevice {
//   .header-root {
//     padding: 0 24px;
//   }
// }

// @mixin min-width $smallDevice {
//   .header-navigation {
//     padding-left: 0;
//   }

//   .header-navigation-list {
//     column-gap: 32px;
//   }

//   .header-navigation-item-link {
//     width: auto;
//     height: auto;
//     background-color: transparent;
//     font-size: 18px;
//     color: hsla(var(--palette-gray-60), 100%);

//     &:hover {
//       color: hsla(var(--palette-gray-80), 100%);
//     }

//     &:after {
//       position: relative;
//       background: none;
//       mask: none;
//     }

//     &.tags {
//       &:after {
//         width: auto;
//         content: 'Tags';
//         mask-image: none;
//       }
//     }

//     &.about {
//       &:after {
//         content: 'About';
//         mask-image: none;
//       }
//     }
//   }
// }
