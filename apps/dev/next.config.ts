import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withVanillaExtract(withMDX(nextConfig));
